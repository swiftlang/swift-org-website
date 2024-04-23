module Kramdown
  module Converter
    class Html
      def convert_header(el, indent)
        el_attribute = el.attr.dup

        if @options[:auto_ids] && !el_attribute['id']
          el_attribute['id'] = generate_id(el.options[:raw_text])
        end

        el_attribute['class'] = "header-with-anchor"

        @toc << [el.options[:level], el_attribute['id'], el.children] if el_attribute['id'] && in_toc?(el)
        level = output_header_level(el.options[:level])
        format_as_block_html("h#{level}", el_attribute, "#{inner(el, indent)} <a href=\"##{el_attribute['id']}\">#</a>", indent)
      end
    end
  end
end
