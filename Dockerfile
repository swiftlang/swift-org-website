# This source file is part of the Swift.org open source project
#
# Copyright (c) 2022 Apple Inc. and the Swift.org project authors
# Licensed under Apache License v2.0 with Runtime Library Exception
#
# See LICENSE.txt for license information
# See CONTRIBUTORS.txt for the list of Swift.org project authors
#
# SPDX-License-Identifier: Apache-2.0

FROM ruby:3.2
LABEL PURPOSE="This image is configured to build and run swift website"

RUN mkdir -p /src
WORKDIR /src

EXPOSE 4000

ENV LC_ALL: C.UTF-8
ENV LANG: en_US.UTF-8
ENV LANGUAGE: en_US.UTF-8

RUN gem install bundler -v '~> 2.4.17'

COPY Gemfile Gemfile.lock /src/
RUN bundle install -j $(nproc)
