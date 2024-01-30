---
layout: page
---

<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="" id="music-player"></iframe>

<hr />

{{content}}

<script>
const player = document.querySelector('iframe');

function music_url(id) {
    return `//music.163.com/outchain/player?type=2&id=${id}&auto=1&&height=66`;
}

function swtich_url(url) {
    player.src = url;
}

swtich_url(music_url(document.querySelector('ul a').href));

document.querySelector('ul').addEventListener('click', (event) => {
    if (event.target.tagName == 'A') {
        event.preventDefault();
        player.contentWindow.focus();
        swtich_url(music_url(event.target.href.split('=').pop()));
    }
})
</script>
