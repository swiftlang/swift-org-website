module Jekyll
  class PackageCategoriesGenerator < Generator
    def generate(site)
      site.data.dig('packages', 'packages', 'categories').each do |category|
        category_page = PageWithoutAFile.new(site, site.source, "packages", "#{category['slug']}.md")
        category_page.data = {}
        category_page.data['layout'] = 'page'
        category_page.data['title'] = category['name']
        category_page.content = "{% include_relative _package-list.html category_slug=\"#{category['slug']}\" %}"
        site.pages << category_page
      end
    end
  end
end
