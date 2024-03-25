module Jekyll
  class PackageCategoriesGenerator < Generator
    def generate(site)
      # Generate one file per category for the Packages sub-pages
      site.data.dig('packages', 'packages', 'categories').each do |category|
        category_page = PageWithoutAFile.new(site, site.source, "packages", "#{category['slug']}.md")
        category_page.data = {
          'layout' => 'page-wide',
          'title' => category['name']
        }
        category_page.content = "{% include_relative _package-list.html category_slug=\"#{category['slug']}\" %}"
        site.pages << category_page
      end
    end
  end

  class CommunityShowcaseHistoryGenerator < Generator
    def generate(site)
      # Generate one page per month for previous Community Showcase lists in the Packages page
      site.data.dig('packages', 'showcase-history', 'years').each do |year|
        year['months'].each do |month|
          history_page = PageWithoutAFile.new(site, site.source, "packages", "showcase-#{month['slug']}-#{year['name']}.md")
          history_page.data = {
            'layout' => 'page-wide',
            'title' => "Community Showcase: #{month['name']} #{year['name']}"
          }
          history_page.content = "{% include_relative _history.html month_slug=\"#{month['slug']}\" %}"
          site.pages << history_page
        end
      end
    end
  end
end
