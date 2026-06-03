(function () {
  var URL_RE = /https?:\/\/[^\s<>"]+/g;
  var SKIP_TAGS = {
    A: true,
    CODE: true,
    PRE: true,
    SCRIPT: true,
    STYLE: true,
    TEXTAREA: true
  };

  function shortenLabel(rawUrl) {
    try {
      var parsed = new URL(rawUrl);
      return parsed.hostname.replace(/^www\./, "");
    } catch (_err) {
      return "外部連結";
    }
  }

  function isSkippable(node) {
    var el = node.parentElement;
    while (el) {
      if (SKIP_TAGS[el.tagName]) return true;
      el = el.parentElement;
    }
    return false;
  }

  function linkifyTextNode(textNode) {
    var text = textNode.nodeValue;
    if (!text || text.indexOf("http") === -1) return;

    URL_RE.lastIndex = 0;
    if (!URL_RE.test(text)) return;
    URL_RE.lastIndex = 0;

    var frag = document.createDocumentFragment();
    var start = 0;
    var match;

    while ((match = URL_RE.exec(text)) !== null) {
      var raw = match[0];
      var url = raw;
      var trailing = "";

      while (/[),.;!?]$/.test(url)) {
        trailing = url.slice(-1) + trailing;
        url = url.slice(0, -1);
      }

      frag.appendChild(document.createTextNode(text.slice(start, match.index)));

      var link = document.createElement("a");
      link.href = url;
      link.textContent = shortenLabel(url);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      frag.appendChild(link);

      if (trailing) frag.appendChild(document.createTextNode(trailing));

      start = match.index + raw.length;
    }

    if (start < text.length) {
      frag.appendChild(document.createTextNode(text.slice(start)));
    }

    textNode.parentNode.replaceChild(frag, textNode);
  }

  function run() {
    var root = document.querySelector(".post-content, .home, main");
    if (!root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf("http") === -1) {
          return NodeFilter.FILTER_REJECT;
        }
        if (isSkippable(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    var current;
    while ((current = walker.nextNode())) {
      nodes.push(current);
    }

    for (var i = 0; i < nodes.length; i += 1) {
      linkifyTextNode(nodes[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();