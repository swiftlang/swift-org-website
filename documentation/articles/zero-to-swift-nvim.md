# From Zero to Swift | Getting started with Swift in Neovim

Neovim is a modern reimplementation of vi, with a lot of new functionality piled
on top including asynchronous operations and lua bindings for a snappy editing
experience. We'll look at configuring a new install of Neovim for Swift
development on Ubuntu 22.04. I have preinstalled the Solarized theme so the
colors may not match yours exactly.

We will start by installing Neovim and Swift and then install `Lazy.nvim` to
manage our plugins. Then we'll configure the SourceKit LSP server, setup
LSP-driven autocompletion with `nvim-cmp`, and snippets with `LuaSnip`. Then
we'll finish with some autocommands that are useful if you need to read
swiftinterface files or find yourself reading SIL. If you already have Neovim,
Swift, and a package manager installed, you can skip down to setting up
[Language Server support](#language-server-support).

- [Prerequisites](#prerequisites)
- [Package Management](#packaging-with-lazy)
- [Language Server](#language-server-support)
    - [File Updates](#file-updating)
- [Autocomplete](#auto-complete)
- [Snippets](#Snippets)
- [Autocommands](#auto-commands)

## Prerequisites

We will want the Lua APIs exposed in fairly recent versions of Neovim, and we'll
need a Swift toolchain. I'm running Ubuntu 22.04 on an X86 machine, so the
commands you use may need to vary depending on your OS. Recent versions of
Neovim have better LSP support, but this means that we need a newer version than
what is in the Ubuntu 22.04 repository. For this install, I used `snap` to
install Neovim v0.9.4.

```sh
 $  sudo snap install nvim --classic
 $  nvim --version
NVIM v0.9.4
Build type: RelWithDebInfo
LuaJIT 2.1.1692716794
Compilation: /usr/bin/cc -O2 -g -Og -g -Wall -Wextra -pedantic -Wno-unused-pa...

   system vimrc file: "$VIM/sysinit.vim"
  fall-back for $VIM: "/usr/share/nvim"

Run :checkhealth for more info
```

Alternatively, the neovim github repository has downloadable packages with the
latest versions. Instructions are available at
https://github.com/neovim/neovim/blob/master/INSTALL.md#install-from-download

Once we have neovim installed, we'll install a Swift toolchain. Go over to
the download page on [swift.org](download.swift.org) and download the release
Swift tarball. This package contains the runtime libraries, compilers, debugger,
and IDE tools needed for a Swift development experience.

```sh
 $  cd ~/Downloads
 $  wget https://download.swift.org/swift-5.10-release/ubuntu2204/swift-5.10-RELEASE/swift-5.10-RELEASE-ubuntu22.04.tar.gz
 $  tar xf swift-5.10-RELEASE-ubuntu22.04.tar.gz
```

That drops a `swift-5.10-RELEASE-ubuntu22.04/usr` directory in our Downloads
directory. The downloads folder isn't a great place to keep things permanently,
but should be fine for now. We'll need to add the compiler and tools to our
path.

```sh
 $  export PATH="$PWD/swift-5.10-RELEASE-ubuntu22.04/usr/bin:$PATH"
 $  which swiftc
/home/ewilde/Downloads/swift-5.10-RELEASE-ubuntu22.04/usr/bin/swiftc
 $  swiftc --version
Swift version 5.10 (swift-5.10-RELEASE)
Target: x86_64-unknown-linux-gnu
```

## Getting Started

We have working copies of neovim and Swift on our path. While we can start with
a `vimrc` file, Neovim is pushing away from the vimscript over to using lua. Lua
is easier to find documentation for since it's an actual language, tends to run
faster, and pulls your configuration out of the main runloop so your editor
stays nice and snappy. You can still use a `vimrc` with vimscript, but we'll use
lua.

The main lua Neovim configuration file goes in `~/.config/nvim`. The other lua
files go in `~/.config/nvim/lua`. Go ahead and create an `init.lua` now;
```sh
 $  mkdir -p ~/.config/nvim/lua && cd ~/.config/nvim
 $  nvim init.lua
```

## Packaging with Lazy

https://github.com/folke/lazy.nvim

While it's possible to set everything up by hand, using a package manager helps
keep your packages up-to-date, and ensures that everything is installed
correctly when copy your configuration to a new computer. Neovim has a builtin
plugin management support, but I have found `lazy.nvim` to work well, so we'll
start with a little bootstrapping script to install lazy if it isn't already,
add it to our runtime path, and finally configure our packages.

At the top of your `init.lua` write:
```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
        "git",
        "clone",
        "--filter=blob:none",
        "https://github.com/folke/lazy.nvim.git",
        "--branch=stable",
        lazypath
    })
end
vim.opt.rtp:prepend(lazypath)
```

This snippet clones `lazy` if it doesn't already exist, and then adds it to the
runtime path. Now we initialize lazy and tell it where to look for the plugin
specs.

```lua
require("lazy").setup("plugins")
```

This configures lazy to look in a `plugins/` directory under our `lua/`
directory for each plugin. We'll also want a place to put our own non-plugin
related configurations, so we'll stick it in `config/`. Go ahead and create
those directories now.

```sh
 $  mkdir lua/plugins lua/config
```

You can read more about setting up Lazy on their github page;
https://github.com/folke/lazy.nvim?tab=readme-ov-file#%EF%B8%8F-configuration.

![Lazy package manger](/assets/images/zero-to-swift-nvim/Lazy.png)

Note that your configuration won't look exactly like this. It will likely only
list `lazy.nvim` since that is all that is installed right now, which isn't very
exciting to look at, so I've added a few plugins to make it look more appealing.

To check that it's working, launch neovim. You should first see an error saying
that there were no specs found for module plugins. This just means that we don't
have any plugins. Press <ENTER>, and then type `:Lazy`. Lazy will list the
plugins loaded. There should only be one right now, "lazy.nvim". This is Lazy
tracking and updating itself.

## Language Server Support

https://github.com/neovim/nvim-lspconfig

Language servers respond to editor requests providing language-specific support.
Neovim has builtin LSP support, so you don't need an external package for LSP,
but adding a configuration for each LSP server manually is a lot of work. Neovim
has a package for this.

Go ahead and create a new file under `lua/plugins/lsp.lua`. In it, we'll start
by adding the following snippet.

```lua
return {
    {
        "neovim/nvim-lspconfig"
        config = function()
            local lspconfig = require('lspconfig')
            lspconfig.sourcekit.setup {}
        end,
    }
}
```

While this gives us LSP support through sourcekit-lsp, there are no keybindings,
so it's not very practical. Lets hook those up now.

We'll set up an auto command that fires when LSP attaches in the `config`
function under where we set up the `sourcekit` server. The keybindings are
applied to all LSP servers so you end up with a consistent experience across
languages.

```lua
config = function()
    local lspconfig = require('lspconfig')
    lspconfig.sourcekit.setup {}

    vim.api.nvim_create_autocmd('LspAttach', {
        desc = 'LSP Actions',
        callback = function(args)
            vim.keymap.set('n', 'K', vim.lsp.buf.hover, {noremap = true, silent = true})
            vim.keymap.set('n', 'gd', vim.lsp.buf.definition, {noremap = true, silent = true})
        end,
    })
end,
```

![LSP powered live error messages](/assets/images/zero-to-swift-nvim/LSP-Error.png)

I've created a little example Swift package that computes Fibonacci numbers
asynchronously. Pressing `shift` + `k` on one of the references to the
`fibonacci` function shows the documentation for that function, along with the
function signature. The LSP integration is also showing that we have an error in
the code.

### File Updating

SourceKit-LSP is increasingly relying on the editor informing the server when
certain files change. This need is communicated through "dynamic registration".
You don't have to understand what that means, but Neovim doesn't implement
dynamic registration. You'll notice this when you update your package manifest,
or add new files to your compile-commands file and LSP doesn't work without
restarting neovim.

Instead, we know that SourceKit-LSP needs this functionality, so we'll enable it
statically. We'll update our sourcekit setup configuration to manually set the
`didChangeWatchedFiles` request.

```lua
lspconfig.sourcekit.setup {
    capabilities = {
        workspace = {
            didChangeWatchedFiles = {
                dynamicRegistration = true,
            },
        },
    },
}
```

https://github.com/microsoft/vscode-eslint/pull/1307
https://github.com/neovim/neovim/issues/13634

## Auto Complete

https://github.com/hrsh7th/nvim-cmp

![LSP-driven autocomplete completing the Foundation module](/assets/images/zero-to-swift-nvim/LSP-Autocomplete.png)

We will use `nvim-cmp` to act as the autocomplete mechanism. We'll start by
telling Lazy to download the package and to load it lazily when we enter insert
mode since you don't need autocompletion if you're not editing the file.

```lua
-- lua/plugins/autocomplete.lua
return {
    {
        "hrsh7th/nvim-cmp",
        version = false,
        event = "InsertEnter",
    },
}
```

`nvim-cmp` doesn't come with completion sources to start with, those are
additional plugins. We'll add the LSP source as a dependency to provide
LSP-powered completions, and tell Lazy that the completions depend on it so that
those also get loaded when we enable auto-completions. I'm also a fan of having
path expansions and expansions from text in the same buffer.

```lua
-- lua/plugins/autocomplete.lua
return {
    {
        "hrsh7th/nvim-cmp",
        version = false,
        event = "InsertEnter",
        dependencies = {
            "hrsh7th/cmp-nvim-lsp",
            "hrsh7th/cmp-path",
            "hrsh7th/cmp-buffer",
        },
    },
    { "hrsh7th/cmp-nvim-lsp, lazy = true },
    { "hrsh7th/cmp-path", lazy = true },
    { "hrsh7th/cmp-buffer, lazy = true },
}
```

Now that we have our plugins set, lets configure the plugin. The `nvim-cmp`
plugin hides a lot of the inner workings, so configuring it is a little
different than the other plugins, specifically around keybindings. We start out
by requiring the module from within its own configuration function and will call
the setup function explicitly.

```lua
{
    "hrsh7th/nvim-cmp",
    version = false,
    event = "InsertEnter",
    dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        "hrsh7th/cmp-path",
        "hrsh7th/cmp-buffer",
    },
    config = function()
        local cmp = require('cmp')
        local opts = {
            -- Where to get completion results from
            sources = cmp.config.sources {
                { name = "nvim_lsp" },
                { name = "path" }
            },
            -- Make 'enter' key select the completion
            mapping = cmp.mapping.preset.insert({
                ["<CR>"] = cmp.mapping.confirm({ select = true })
            }),
        }
        cmp.setup(opts)
    end,
},
```

Using the `tab` key to select completions is a fairly popular option, so we'll
go ahead and set that up now.

```lua
mapping = cmp.mapping.preset.insert({
    ["<CR>"] = cmp.mapping.confirm({ select = true }),
    ["<tab>"] = cmp.mapping(function(original)
        if cmp.visible() then
            cmp.select_next_item() -- run completion selection if completing
        else
            original()      -- run the original behavior if not completing
        end
    end, {"i", "s"}),
    ["<S-tab>"] = cmp.mapping(function(original)
        if cmp.visual() then
            cmp.select_prev_item()
        else
            original()
        end
    end, {"i", "s"}),
}),
```

Pressing `tab` while the completion menu is visible will select the next
completion and `shift` + `tab` will select the previous item. The tab behavior
falls back on whatever pre-defined behavior was there originally if the menu
isn't visible.

## Snippets

https://github.com/L3MON4D3/LuaSnip

Snippets are a great way to improve your workflow by expanding short pieces of
text into anything you like. Lets hook those up now. We'll use `LuaSnip` as our
snippet plugin.

Create a new file in your plugins directory for configuring the snippet plugin.

```lua
-- lua/plugins/snippets.lua
return {
    {
        'L3MON4D3/LuaSnip',
        conifg = function(opts)
            require('luasnip').setup(opts)
            require('luasnip.loaders.from_snipmate').load({ paths = "./snippets" })
        end,
    },
}
```

Now we'll wire the LuaSnippet expansions into `nvim-cmp`. First, we'll add
`LuaSnip` as a dependency of `nvim-cmp` to ensure that it gets loaded before
`nvim-cmp`. Then we'll wire it into the tab key expansion behavior.

```lua
{
    "hrsh7th/nvim-cmp",
    version = false,
    event = "InsertEnter",
    dependencies = {
        "hrsh7th/cmp-nvim-lsp",
        "hrsh7th/cmp-path",
        "hrsh7th/cmp-buffer",
        "L3MON4D3/LuaSnip",
    },
    config = function()
        local cmp = require('cmp')
        local luasnip = require('cmp')
        local opts = {
            -- Where to get completion results from
            sources = cmp.config.sources {
                { name = "nvim_lsp" },
                { name = "path" },
            },
            mapping = cmp.mapping.preset.insert({
                -- Make 'enter' key select the completion
                ["<CR>"] = cmp.mapping.confirm({ select = true }),
                -- Super-tab behavior
                ["<tab>"] = cmp.mapping(function(original)
                    if cmp.visible() then
                        cmp.select_next_item() -- run completion selection if completing
                    elseif luasnip.expand_or_jumpable() then
                        luasnip.expand_or_jump() -- expand snippets
                    else
                        original()      -- run the original behavior if not completing
                    end
                end, {"i", "s"}),
                ["<S-tab>"] = cmp.mapping(function(original)
                    if cmp.visual() then
                        cmp.select_prev_item()
                    elseif luasnip.expand_or_jumpable() then
                        luasnip.jump(-1)
                    else
                        original()
                    end
                end, {"i", "s"}),
            }),
            snippets = {
                expand = function(args)
                    luasnip.lsp_expand(args)
                end,
            },
        }
        cmp.setup(opts)
    end,
},
```

Now our tab key is thoroughly overloaded in super-tab fashion; if the
completion window is open, pressing tab selects the next item in the list. If
you press tab over a snippet, the snippet will expand and continuing to press
tab results in jumping to the next insertion point. Finally, if you're neither
auto-completing nor expanding a snippet, it will behave like a normal `tab` key.

Now we need to write up some snippets. LuaSnip supports several snippet formats,
including the popular TextMate format, VSCode format, its own Lua-based API, and
snippets coming from an LSP server.

Here are some snippets that I've found to be useful:

```snipmate
snippet pub "public access control"
  public $0

snippet priv "private access control"
  private $0

snippet if "if statement"
  if $1 {
    $2
  }$0

snippet ifl "if let"
  if let $1 = ${2:$1} {
    $3
  }$0

snippet ifcl "if case let"
  if case let $1 = ${2:$1} {
    $3
  }$0

snippet func "function declaration"
  func $1($2) $3{
    $0
  }

snippet funca "async function declaration"
  func $1($2) async $3{
    $0
  }

snippet guard
  guard $1 else {
    $2
  }$0

snippet guardl
  guard let $1 else {
    $2
  }$0

snippet main
  @main public struct ${1:App} {
    public static func main() {
      $2
    }
  }$0
```

Another popular snippet plugin worth mentioning is UltiSnips which allows you to
use inline Python while defining the snippet, greatly improving what kinds of
snippets you can write.

## Auto Commands

Sometimes you'll want to open swift interface files or SIL files. By default,
you won't get much assistance. We'll use autocommands to configure your editing
experience now.

Create a new file for you autocommand configurations.

```lua
-- lua/config/autocmds.lua

local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

-- Filetypes
augroup("SetFileTypes", { clear = true })
autocmd({'Bufread', 'Bufnewfile'}, {
    group = 'SetFileTypes',
    pattern = "*.swiftinterface",
    command = 'setlocal ft=swift tw = 0',
})

autocmd({'Bufread', 'Bufnewfile'}, {
    group = 'SetFileTypes',
    pattern = "*.sil",
    command = 'setlocal ft=sil',
})
```

Then include that in your `init.lua`.

```
-- init.lua
...
require('config.autocmds')
```

Restarting vim, you will have syntax highlighting for swift interface and SIL
files.

# Conclusion

Swift development with Neovim is a solid experience once you have things
configured correctly. This should give you foundation for building your
development experience.

TODO: Finish this

# Files

Here are the files for this configuration in their final form.

```lua
-- init.lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
    vim.fn.system({
        "git",
        "clone",
        "--filter=blob:none",
        "https://github.com/folke/lazy.nvim.git",
        "--branch=stable",
        lazypath
    })
end
vim.opt.rtp:prepend(lazypath)
require("lazy").setup("plugins", {
  ui = {
    icons = {
      cmd = "",
      config = "",
      event = "",
      ft = "",
      init = "",
      keys = "",
      plugin = "",
      runtime = "",
      require = "",
      source = "",
      start = "",
      task = "",
      lazy = "",
    },
  },
})
require("config.autocmds")

vim.opt.wildmenu = true
vim.opt.wildmode = "list:longest,list:full" -- don't insert, show options

-- line numbers
vim.opt.nu = true
vim.opt.rnu = true

-- textwrap at 80 cols
vim.opt.tw = 80

-- set solarized colorscheme.
-- NOTE: Uncomment this if you have installed solarized, otherwise you'll see
--       errors.
-- vim.cmd.background = "dark"
-- vim.cmd.colorscheme("solarized")
-- vim.api.nvim_set_hl(0, "NormalFloat", { bg = "none" })
```

```lua
-- lua/config/autocmds.lua
local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

-- Filetypes
augroup("SetFileTypes", { clear = true })
autocmd({'Bufread', 'Bufnewfile'}, {
    group = 'SetFileTypes',
    pattern = "*.swiftinterface",
    command = 'setlocal ft=swift tw = 0',
})

autocmd({'Bufread', 'Bufnewfile'}, {
    group = 'SetFileTypes',
    pattern = "*.sil",
    command = 'setlocal ft=sil',
})
```

```lua
-- lua/plugins/autocomplete.lua
return {
  {
    "hrsh7th/nvim-cmp",
    version = false,
    event = "InsertEnter",
    dependencies = {
      "hrsh7th/cmp-nvim-lsp",
      "hrsh7th/cmp-path",
      "hrsh7th/cmp-buffer",
    },
    config = function()
      local cmp = require('cmp')
      local luasnip = require('luasnip')
      local opts = {
        sources = cmp.config.sources {
          { name = "nvim_lsp", },
          { name = "path", },
          { name = "buffer", },
        },
        mapping = cmp.mapping.preset.insert({
          ["<CR>"] = cmp.mapping.confirm({ select = true }),
          ["<tab>"] = cmp.mapping(function(original)
            print("tab pressed")
            if cmp.visible() then
              print("cmp expand")
              cmp.select_next_item()
            elseif luasnip.expand_or_jumpable() then
              print("snippet expand")
              luasnip.expand_or_jump()
            else
              print("fallback")
              original()
            end
          end, {"i", "s"}),
          ["<S-tab>"] = cmp.mapping(function(original)
            if cmp.visible() then
              cmp.select_prev_item()
            elseif luasnip.expand_or_jumpable() then
              luasnip.jump(-1)
            else
              original()
            end
          end, {"i", "s"}),

        })
      }
      cmp.setup(opts)
    end,
  },
  { "hrsh7th/cmp-nvim-lsp", lazy = true },
  { "hrsh7th/cmp-path", lazy = true },
  { "hrsh7th/cmp-buffer", lazy = true },
}
```

```lua
-- lua/plugins/lsp.lua
return {
  {
    "neovim/nvim-lspconfig",
    config = function()
      local lspconfig = require('lspconfig')
    lspconfig.sourcekit.setup {
      capabilities = {
          workspace = {
            didChangeWatchedFiles = {
              dynamicRegistration = true,
            },
          },
        },
      }

      vim.api.nvim_create_autocmd('LspAttach', {
        desc = "LSP Actions",
        callback = function(args)
          vim.keymap.set("n", "K", vim.lsp.buf.hover, {noremap = true, silent = true})
          vim.keymap.set("n", "gd", vim.lsp.buf.definition, {noremap = true, silent = true})
        end,
      })
    end,
  },
}
```

```lua
-- lua/plugins/snippets.lua
return {
  {
    'L3MON4D3/LuaSnip',
    lazy = false,
    config = function(opts)
      local luasnip = require('luasnip')
      luasnip.setup(opts)
      require('luasnip.loaders.from_snipmate').load({ paths = "./snippets"})
    end,
  }
}
```

```snipmate
# snippets/swift.snippets

snippet pub "public access control"
  public $0

snippet priv "private access control"
  private $0

snippet if "if statement"
  if $1 {
    $2
  }$0

snippet ifl "if let"
  if let $1 = ${2:$1} {
    $3
  }$0

snippet ifcl "if case let"
  if case let $1 = ${2:$1} {
    $3
  }$0

snippet func "function declaration"
  func $1($2) $3{
    $0
  }

snippet funca "async function declaration"
  func $1($2) async $3{
    $0
  }

snippet guard
  guard $1 else {
    $2
  }$0

snippet guardl
  guard let $1 else {
    $2
  }$0

snippet main
  @main public struct ${1:App} {
    public static func main() {
      $2
    }
  }$0
```
