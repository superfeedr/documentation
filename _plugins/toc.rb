class Toc < Liquid::Tag

  def render_toc(toc)
    _t = ''
    toc.each do |t, v|
      if v.empty?
        _t += "<li>
        <a href=\"##{t.gsub(/ /, '-').downcase}\">#{t}</a>
        </li>
        "
      else
         _t += "<li>
         <a href=\"##{t.gsub(/ /, '-').downcase}\">#{t}</a>
         <ul class=\"docs-inline-nav\">
         #{render_toc(v)}
         </ul>
         </li>"
      end
    end
    _t
  end

  def render(context)
    "<ul id=\"docsnav\" class=\"docs-inline-nav nav nav-list\">#{render_toc(context['page.toc'])}</ul>"
  end
end

Liquid::Template.register_tag('toc', Toc)

