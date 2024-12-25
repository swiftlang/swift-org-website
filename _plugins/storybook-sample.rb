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

      # Process Liquid includes
      template = Liquid::Template.parse(content)
      rendered_content = template.render(context)
      language = rendered_content == content ? 'html' : 'liquid'

      code_output = if !hide_code
        <<~CODE
          #### Code Example

          <button class="copy-code">copy code</button>
          ```#{language}
          #{content.strip}
          ```
        CODE
      else
        ""
      end

      <<~HTML
        #{code_output}

        #### Render Example
        <button class="fullscreen">fullscreen</button>
        <button class="mobile">mobile</button>
        <button class="dark">dark</button>

        <div class="storybook-render">
          #{rendered_content}
        </div>
      HTML
    end
  end
end

Liquid::Template.register_tag('storybook_sample', Jekyll::StorybookSampleTag)
