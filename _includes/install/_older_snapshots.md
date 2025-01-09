<table id="linux-builds" class="downloads">
  <thead>
    <tr>
      <th class="download">下载</th>
    </tr>
  </thead>
  <tbody>
    {% for build in include.builds | offset:1 | limit:10 %}
      <tr>
        <td class="download">
          <span class="release">
            <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.download }}" title="下载" download>{{ build.date | date: '%Y年%-m月%-d日' }}</a>
            {% if build.download_signature %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.download_signature }}" title="PGP 签名" class="signature">签名</a>
            {% endif %}
            {% if build.debug_info %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.debug_info }}" title="调试符号" class="debug">调试符号</a>
            {% if build.debug_info_signature %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.debug_info_signature }}" title="调试符号的 PGP 签名">签名</a>
            {% endif %}
            {% endif %}
          </span>
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>
