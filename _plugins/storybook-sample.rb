module Jekyll
  class StorybookSampleTag < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @params = {}
      markup.scan(/(\w+)\s*=\s*["'](.+?)["']/).each do |key, value|
        @params[key] = value
      end
    end

    def render(context)
      content = super
      hide_code = @params['hide_code'] == 'true'

      code_output = if !hide_code
        <<~CODE
          #### Code
          ```html
          #{content.strip}
          ```
        CODE
      else
        ""
      end

      <<~HTML
        #{code_output}

        #### Render
        <div class="storybook-render">
          #{content}
        </div>
      HTML
    end
  end
end

Liquid::Template.register_tag('storybook_sample', Jekyll::StorybookSampleTag)
