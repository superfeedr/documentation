class Navlink < Liquid::Tag

	def initialize(name, params, tokens)
		@url, @title = params.split(",").map(&:strip)
	end

  def render(context)
		if context['page.url'] == @url
    	"<a href=\"#{@url}\" class=\"docs-nav-link docs-nav-link-current\">#{@title}</a>"
    else
    	"<a href=\"#{@url}\" class=\"docs-nav-link\">#{@title}</a>"
    end
  end
end

Liquid::Template.register_tag('navlink', Navlink)

