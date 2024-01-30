// Add Target To Specify Anchor
var links = document.getElementsByTagName('a'),
    elements = [
        document.getElementsByClassName('pagination'),
        document.getElementsByClassName('site-header'),
    ];

function exceptions(elements, anchor) {
    for (let i=0; i<elements.length; i++) {
        if (elements[i].length) {
            let anchors = elements[i][0].getElementsByTagName('a');
            for (j=0; j<anchors.length; j++) {
                if (anchor == anchors[j]) {
                    return true;
                }
            }
        }
    }
    if (anchor.getAttribute('href').startsWith('#')) {
        return true;
    }
    return false;
}

for (let i=0; i<links.length; i++) {
    let ignore = exceptions(elements, links[i]);
    if (! ignore) {
        links[i].setAttribute('target', '_blank');
    }
}

// Display Tags Or Category

// var items = document.getElementsByClassName('taxonomy-item'),
//     blocks = document.getElementsByClassName('taxonomy-block');
// for (let i=0; i<items.length; i++) {
//     items[i].addEventListener('click', showItemBlock);
// }
// function showItemBlock(event) {
//     for (let i=0; i<blocks.length; i++) {
//         if (this.dataset.index == blocks[i].dataset.index) {
//             blocks[i].style.display = 'block';
//         } else {
//             blocks[i].style.display = 'none';
//         }
//     }
// }

var items = document.getElementsByClassName('taxonomy-item'),
    blocks = document.getElementsByClassName('taxonomy-blocks');
for (let i=0; i<items.length; i++) {
    items[i].addEventListener('click', showItemBlock);
}
function showItemBlock(event) {
    blocks.item(0).innerHTML = '';
    let ul = document.createElement('ul'),
        tag = tags[this.textContent],
        posts = Object.keys(tag);
    for (let i=0; i<posts.length; i++) {
        let li = document.createElement('li')
            a = document.createElement('a'),
            text = document.createTextNode(posts[i]);
        a.setAttribute('href', tag[posts[i]]);
        a.setAttribute('target', '_blank');
        a.appendChild(text);
        li.appendChild(a);
        ul.append(li);
    }
    blocks.item(0).append(ul);
}

// Show Comment Content
var post_content = document.getElementsByClassName('post-content')[0];

function showNextComment() {
    // console.log(this.nodeName);
    let comment = this.previousSibling.previousSibling.data.trim()
        content = document.createTextNode(comment),
        br = document.createElement('br');
    if (this.nodeName == 'DIV') return false;
    this.appendChild(br);
    this.appendChild(content);
}

if (post_content) {
    for (const element of post_content.children) {
        element.addEventListener('dblclick', showNextComment, {'once': true});
    }
}
