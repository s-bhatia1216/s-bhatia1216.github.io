---
layout: page
title: "GPU Acceleration of Shap-E on Apple Silicon"
description: "PR to OpenAI's Shap-E: 4+ hours → under 4 minutes"
importance: 2
category: systems
---

**Mar to Jul 2025** &nbsp;|&nbsp; Open-source contribution &nbsp;|&nbsp; _Python, PyTorch MPS, Metal Performance Shaders_

<p>
  <a class="btn btn-sm z-depth-0" role="button" href="https://github.com/openai/shap-e/pull/159" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i> Pull request #159</a>
</p>

[Shap-E](https://github.com/openai/shap-e) is OpenAI's open-source model for generating 3D objects from a text prompt or a single image. On an Apple Silicon Mac it couldn't use the GPU at all: it fell back to the CPU, and a single default image-to-3D generation took about **4 hours**. I tracked down why, fixed it, and filed a pull request upstream. With the fix, the same generation runs on the GPU through PyTorch's Metal Performance Shaders (MPS) backend in **just under 4 minutes**, roughly a 60x speedup, on a Mac mini with an M4 Pro.

The pull request is open and awaiting review from the Shap-E maintainers.

## The problem

Shap-E is a diffusion model, so generating one object means running the network through many denoising steps. At every step, the sampler looks up per-timestep constants (the noise schedule) with a helper called `_extract_into_tensor`. That helper builds a tensor from a NumPy array on the target device and indexes into it with the batch's timesteps.

On MPS, that advanced indexing operation wasn't supported by PyTorch, so the whole pipeline couldn't run on the Apple GPU and stayed on the CPU. The model itself was perfectly capable of running on MPS; one small lookup was blocking it.

## The fix

Rather than moving the whole model off the GPU to work around one operation, the patch routes only that lookup through the CPU and hands the result back to the GPU:

```python
is_mps = hasattr(timesteps, "device") and timesteps.device.type == "mps"

if is_mps:
    # Do the unsupported gather on the CPU...
    cpu_arr = th.from_numpy(arr.copy().astype(np.float32))
    cpu_tensor = cpu_arr[timesteps.cpu()].clone().contiguous().float()
    # ...then move the small result to the GPU
    res = cpu_tensor.to(device=timesteps.device)
else:
    res = th.from_numpy(arr).to(device=timesteps.device)[timesteps].float()
```

The values being looked up are tiny (one number per item in the batch), so the extra CPU-to-GPU copy costs well under a millisecond per call, which is negligible next to the diffusion loop. All of the heavy computation in the denoising loop now runs on the GPU.

The example notebooks also used to hard-code `cuda` or fall back to `cpu`. They now pick the best available device automatically, in the order MPS, then CUDA, then CPU:

```python
device = torch.device(
    'mps' if torch.backends.mps.is_available()
    else 'cuda' if torch.cuda.is_available()
    else 'cpu'
)
```

## Keeping everyone else working

The change only takes the new path when the tensor is actually on MPS. On NVIDIA GPUs and on plain CPUs, the original code runs untouched, so existing users see no difference. I ran the text-to-3D and image-to-3D example notebooks end to end on an M4 Pro and an M4 Max (macOS 15.4), and compared the 3D meshes from 25+ diffusion sampling runs across CUDA and MPS to confirm the generated geometry didn't regress.

## Results

| Setup | Default image-to-3D generation |
| --- | --- |
| Mac mini (M4 Pro), CPU fallback (before) | about 4 hours |
| Mac mini (M4 Pro), GPU via MPS (after) | just under 4 minutes |

The whole change is 53 lines added and 10 removed across four files: the diffusion helper and the three example notebooks.
