module Jekyll
  class PackageCategoriesGenerator < Generator
    def generate(site)
      # Generate one file per category for the Packages sub-pages
      site.data.dig('packages', 'packages', 'categories').each do |category|
        category_page = PageWithoutAFile.new(site, site.source, "packages", "#{category['slug']}.md")
        category_page.data = {
          # Front matter
          'layout' => 'page-wide',
          'title' => category['name']
        }
        category_page.content = "{% include_relative _package-list.html category_slug=\"#{category['slug']}\" %}"
        site.pages << category_page
      end
    end
  end
end
