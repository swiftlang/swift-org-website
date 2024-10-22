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

      <<~HTML
        #### Code
        ```html
        #{content.strip}
        ```

        #### Render
        <div class="storybook-sample">
          #{content}
        </div>
      HTML
    end
  end
end

Liquid::Template.register_tag('storybook_sample', Jekyll::StorybookSampleTag)
