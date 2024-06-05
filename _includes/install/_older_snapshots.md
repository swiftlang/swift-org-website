<table id="linux-builds" class="downloads">
  <thead>
    <tr>
      <th class="download">Download</th>
    </tr>
  </thead>
  <tbody>
    {% for build in include.builds | offset:1 | limit:10 %}
      <tr>
        <td class="download">
          <span class="release">
            <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.download }}" title="Download" download>{{ build.date | date: '%B %-d, %Y' }}</a>
            {% if build.download_signature %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.download_signature }}" title="PGP Signature" class="signature">Signature</a>
            {% endif %}
            {% if build.debug_info %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.debug_info }}" title="Debugging Symbols" class="debug">Debugging Symbols</a>
            {% if build.debug_info_signature %}
              <a href="https://download.swift.org/{{ include.branch_dir }}/{{ include.platform_dir }}/{{ build.dir }}/{{ build.debug_info_signature }}" title="PGP Signature for Debugging Symbols">Signature</a>
            {% endif %}
            {% endif %}
          </span>
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>
