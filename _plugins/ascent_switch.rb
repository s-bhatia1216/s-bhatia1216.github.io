# Ascent: adds the Professional / Creative mode switch to the home page.
#
# The page layouts live in the al_folio_core gem, so instead of overriding them
# this hook appends three small tags to the rendered home page:
#   1. a one-line inline script that marks <html> before first paint when
#      creative mode is requested (?mode=creative or a saved choice), so the
#      professional page does not flash before the creative view covers it;
#   2. the switch stylesheet (about 2 KB);
#   3. the deferred switch script, carrying the labels from _data/ascent.yml.
# Everything else in creative mode is loaded by the switch only when it is
# turned on. Every other page is left untouched.

require "cgi"

module Ascent
  BOOT = <<~JS.gsub(/\s*\n\s*/, "")
    try{
    var m=new URLSearchParams(location.search).get("mode")||localStorage.getItem("ascent-mode");
    if(m==="creative")document.documentElement.classList.add("ascent-boot");
    }catch(e){}
  JS

  def self.inject(doc)
    return unless doc.output_ext == ".html" && doc.output.is_a?(String)
    return if doc.data["layout"].nil? || doc.data["layout"] == "null"
    # The switch lives on the home page only; every other tab stays purely professional.
    return unless doc.url == "/" || doc.url == "/index.html"
    html = doc.output
    return if html.include?("ascent/switch.js") || !html.include?("</head>")

    site = doc.site
    base = site.config["baseurl"].to_s
    v = site.time.to_i
    labels = (site.data.dig("ascent", "switch") || {})
    pro = CGI.escapeHTML(labels["professional"] || "Professional")
    cre = CGI.escapeHTML(labels["creative"] || "Creative")

    head = %(<script>#{BOOT}</script><link rel="stylesheet" href="#{base}/assets/ascent/switch.css?v=#{v}">)
    body = %(<script defer src="#{base}/assets/ascent/switch.js?v=#{v}" data-base="#{base}" data-v="#{v}" data-label-pro="#{pro}" data-label-cre="#{cre}"></script>)

    html = html.sub("</head>", "#{head}</head>")
    i = html.rindex("</body>")
    html = html[0...i] + body + html[i..] if i
    doc.output = html
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  Ascent.inject(doc)
end
