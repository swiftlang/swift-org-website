---
layout: new-layouts/base
date: 2024-06-05 12:00:00
title: Configuring Emacs for Swift Development
author: [al45tair]
---

Emacs is a highly customizable text editor that has its origins in a
macro package for the Digital Equipment Corporation TECO editor.
A number of Emacs-like editors and derivatives have existed over the
years, but this guide will focus on [GNU
Emacs](https://www.gnu.org/software/emacs/).

This guide will walk you through setting up a new install of Emacs for
Swift development; it does not assume any particular operating system,
but where relevant may give system-specific hints to help you get
started.  It also is not intended to teach you to use Emacs; if you
want to learn Emacs, try this resource: [Emacs
Tour](https://www.gnu.org/software/emacs/tour/).

We assume for the purposes of this guide that you have already
installed Swift; if not, please [follow the installation instructions
for your platform on the Swift website](https://www.swift.org/install)
before continuing.

## Installing Emacs

There are generic [installation instructions on the GNU Emacs
website](https://www.gnu.org/software/emacs/download.html).  Specific
instructions are given below for some common platforms.

### macOS

The [Emacs for Mac OS X](https://emacsformacosx.com) website provides
universal binaries in a standard Mac disk image.  Downloading the
image from that site, opening it and dragging it to your `Applications`
folder is the easiest way to install a native Emacs for macOS
development.

### Microsoft Windows

You can download GNU Emacs for Windows from [a nearby GNU
mirror](http://ftpmirror.gnu.org/emacs/windows) or the [main GNU FTP
server](http://ftp.gnu.org/gnu/emacs/windows/).  The simplest thing is
likely to run the `emacs-<version>-installer.exe` executable, which
will install Emacs and set up some shortcuts for you.

### Debian-based Linux (including Ubuntu)

From a prompt, enter

```console
$ sudo apt-get install emacs
```

or if you are doing this on a server system or in a container where
you have no plans to use the GUI,

```console
$ sudo apt-get install emacs-nox
```

### RedHat-based Linux (RHEL, Centos, Fedora)

From a prompt, enter

```console
$ sudo dnf install emacs
```

(On older builds you may need to use `yum` rather than `dnf`, but the
latter is the newer, better option if it's available.)

## Configuring Emacs

Emacs veterans probably remember downloading and installing Lisp
packages manually, but these days it's best to use a package manager.
We'll also configure [MELPA](https://melpa.org), which is a popular
package repository for Emacs.  To do this, open Emacs, enter `C-x C-f
~/.emacs` and hit enter.  Then add the following to your `.emacs`
file:

```lisp
;;; Add MELPA as a package source
(require 'package)
(setq package-enable-at-startup nil)
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/"))
(package-initialize)
```

We'll also set-up
[`use-package`](https://github.com/jwiegley/use-package), since that
simplifies package installation if you want to be able to just copy
your `~/.emacs` to a new machine and have things just work.  To do
that, add

```lisp
;;; Bootstrap `use-package'
(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

(eval-when-compile
  (require 'use-package))
```

In a moment we'll want to be able to locate `sourcekit-lsp`; this
depends on where Swift is installed, so let's add a Lisp function to
do that:

```lisp
;;; Locate sourcekit-lsp
(defun find-sourcekit-lsp ()
  (or (executable-find "sourcekit-lsp")
      (and (eq system-type 'darwin)
           (string-trim (shell-command-to-string "xcrun -f sourcekit-lsp")))
      "/usr/local/swift/usr/bin/sourcekit-lsp"))
```

Next, we'll install some useful packages:

```lisp
;;; Packages we want installed for Swift development

;; .editorconfig file support
(use-package editorconfig
    :ensure t
    :config (editorconfig-mode +1))

;; Swift editing support
(use-package swift-mode
    :ensure t
    :mode "\\.swift\\'"
    :interpreter "swift")

;; Rainbow delimiters makes nested delimiters easier to understand
(use-package rainbow-delimiters
    :ensure t
    :hook ((prog-mode . rainbow-delimiters-mode)))

;; Company mode (completion)
(use-package company
    :ensure t
    :config
    (global-company-mode +1))

;; Used to interface with swift-lsp.
(use-package lsp-mode
    :ensure t
    :commands lsp
    :hook ((swift-mode . lsp)))

;; lsp-mode's UI modules
(use-package lsp-ui
    :ensure t)

;; sourcekit-lsp support
(use-package lsp-sourcekit
    :ensure t
    :after lsp-mode
    :custom
    (lsp-sourcekit-executable (find-sourcekit-lsp) "Find sourcekit-lsp"))
```

We'll also add a couple of packages to make things look prettier and
more modern; you could install a theme or change the fonts as well if
you wish - the possibilities for customizing Emacs are nearly endless:

```lisp
;; Powerline
(use-package powerline
  :ensure t
  :config
  (powerline-default-theme))

;; Spaceline
(use-package spaceline
  :ensure t
  :after powerline
  :config
  (spaceline-emacs-theme))
```

Finally, let's turn off the splash screen, since we don't want to see
that whenever we start Emacs, and we'll also disable the toolbar:

```lisp
;;; Don't display the start screen
(setq inhibit-startup-screen t)

;;; Disable the toolbar
(tool-bar-mode -1)
```

Enter `C-x C-s` to save your new `.emacs` file, then restart Emacs.

## Conclusion

We were able to get Emacs set-up to edit Swift code, with syntax
highlighting and integration with SourceKit-LSP as well as support for
modern best practices like the use of `.editorconfig` files to allow
projects to easily set their own preferences for tab widths and
formatting.

## Files

Here's a complete `.emacs` file containing the full configuration:

```lisp
;;; Add MELPA as a package source
(require 'package)
(setq package-enable-at-startup nil)
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/"))
(package-initialize)

;;; Bootstrap `use-package'
(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

(eval-when-compile
  (require 'use-package))

;;; Locate sourcekit-lsp
(defun find-sourcekit-lsp ()
  (or (executable-find "sourcekit-lsp")
      (and (eq system-type 'darwin)
           (string-trim (shell-command-to-string "xcrun -f sourcekit-lsp")))
      "/usr/local/swift/usr/bin/sourcekit-lsp"))

;;; Packages we want installed for Swift development

;; .editorconfig file support
(use-package editorconfig
    :ensure t
    :config (editorconfig-mode +1))

;; Swift editing support
(use-package swift-mode
    :ensure t
    :mode "\\.swift\\'"
    :interpreter "swift")

;; Rainbow delimiters makes nested delimiters easier to understand
(use-package rainbow-delimiters
    :ensure t
    :hook ((prog-mode . rainbow-delimiters-mode)))

;; Company mode (completion)
(use-package company
    :ensure t
    :config
    (global-company-mode +1))

;; Used to interface with swift-lsp.
(use-package lsp-mode
    :ensure t
    :commands lsp
    :hook ((swift-mode . lsp)))

;; lsp-mode's UI modules
(use-package lsp-ui
    :ensure t)

;; sourcekit-lsp support
(use-package lsp-sourcekit
    :ensure t
    :after lsp-mode
    :custom
    (lsp-sourcekit-executable (find-sourcekit-lsp) "Find sourcekit-lsp"))

;; Powerline
(use-package powerline
  :ensure t
  :config
  (powerline-default-theme))

;; Spaceline
(use-package spaceline
  :ensure t
  :after powerline
  :config
  (spaceline-emacs-theme))

;;; Don't display the start screen
(setq inhibit-startup-screen t)

;;; Disable the toolbar
(tool-bar-mode -1)
```
