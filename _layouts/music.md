---
layout: page
---

<div id="music-player">
    <div class="loading"></div>
    <iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="about:blank" class="hide"></iframe>
</div>

<hr />

{{content}}

<h2>○ Chinese</h2>

<ul class="music-list">
    {% for music in site.data.music_chinese %}
    <li><a href="https://music.163.com/song?id={{ music[0] }}">{{ music[1] }}</a></li>
    {% endfor %}
</ul>

<h2>○ Foreign</h2>

<ul class="music-list">
    {% for music in site.data.music_foreign %}
    <li><a href="https://music.163.com/song?id={{ music[0] }}">{{ music[1] }}</a></li>
    {% endfor %}
</ul>

<script>
    const player_box = document.querySelector('#music-player');
    const loading = player_box.querySelector('.loading')
    const player = player_box.querySelector('iframe');


    player.addEventListener('load', event => loading.classList.add('hide'))

    function music_url(id) {
        return `//music.163.com/outchain/player?type=2&id=${id}&auto=1&height=66`;
    }

    function swtich_event(event) {
        if (event.target.tagName == 'A') {
            event.preventDefault();
            loading.classList.remove('hide')
            player.src = music_url(event.target.href.split('=').pop());
        }
    }

    player.src = music_url(document.querySelector('ul a').href);
    document.querySelectorAll('ul').forEach(
        element => element.addEventListener('click', swtich_event));
</script>
