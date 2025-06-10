require 'yaml'

module Jekyll
  class LiquidInYaml < Generator
    priority :highest

    def generate(site)
      context = Liquid::Context.new(site.site_payload)

      site.data.each do |filename, content|
        site.data[filename] = process_yaml(content, context)
      end
    end

    private

    def render_liquid_string(data, context)
      last = nil
      current = data

      while current != last && current =~ /{{|{%/
        last = current
        current = Liquid::Template.parse(current).render!(context)
      end
      current
    end

    def process_yaml(data, context)
      case data
      when Hash
        data.transform_values { |value| process_yaml(value, context) }
      when Array
        data.map { |item| process_yaml(item, context) }
      when String
        if data =~ /({{.*}}|{%.+%})/
          begin
            render_liquid_string(data, context)
          rescue => e
            Jekyll.logger.error "LiquidInYaml Plugin:", "Error rendering: #{data.inspect}"
            Jekyll.logger.error "", e.message
            data
          end
        else
          data
        end
      else
        data
      end
    end

  end
end
