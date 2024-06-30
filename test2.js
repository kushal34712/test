const folders = [
  {
    name: "July",
    children: [
      {
        name: "Games",
        children: [
            {
            name: "Level 1",
            children: [
              {
                id: "file-src-index-html",
                name: "Lab 1",
                url: "https://github.com/lavishsheth/code/blob/Protect%20Sensitive%20Data%20with%20Data%20Loss%20Prevention%3A%20Challenge%20Lab",
                folder: "src/src_11",
              },
              {
                id: "file-src-styles-css",
                name: "Lab 2",
                url: "https://github.com/lavishsheth/code/blob/Analyze%20Sentiment%20with%20Natural%20Language%20API%3A%20Challenge%20Lab",
                folder: "src/src_11",
              },
            ],
        }
        ],
      },
    ],
  },
  {
    name: "assets",
    children: [
      {
        id: "file-assets-logo-png",
        name: "logo.png",
        url: "https://raw.githubusercontent.com/kushal34712/Btecky/main/assets/logo.png",
        folder: "assets",
      },
      {
        id: "file-assets-background-jpg",
        name: "background.jpg",
        url: "https://github.com/lavishsheth/code/blob/9%20Nov%202023%201mon_subcription",
        folder: "assets",
      },
    ],
  },
  {
    name: "docs",
    children: [
      {
        id: "file-docs-readme-md",
        name: "README.md",
        url: "https://github.com/kushal34712/Btecky/blob/main/Newyearanimation.html",
        folder: "docs",
      },
    ],
  },
];

function createFileStructure(data, parentName = "") {
  let html = "<ul>";
  data.forEach((item) => {
    const currentName = parentName ? `${parentName} -- ${item.name}` : item.name;
    if (item.children) {
      html += `<li class="folder">${item.name}<ul class="hidden">`;
      html += createFileStructure(item.children, currentName);
      html += "</ul></li>";
    } else {
      html += `<li id="${item.id}" data-url="${item.url}" data-folder="${currentName}">${item.name}</li>`;
    }
  });
  html += "</ul>";
  return html;
}

const fileStructureContainer = document.getElementById("file-structure");
fileStructureContainer.innerHTML = createFileStructure(folders);



async function fetchAndDisplayCode(url, folder, name) {
    const message = document.getElementById('message');
    const lineNumbers = document.getElementById('line-numbers');
    const codeContent = document.getElementById('code-content');
    const fileInfo = document.getElementById('file-info');
    const mainContent = document.querySelector('.main-content');

    const apiUrl = url
        .replace('https://github.com/', 'https://api.github.com/repos/')
        .replace('/blob/', '/contents/');

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch file content.');
        }

        const data = await response.json();
        const content = atob(data.content); // Decode Base64 content

        const lines = content.split('\n');

        lineNumbers.innerHTML = lines.map((_, index) => `<div>${index + 1}</div>`).join('');
        codeContent.innerHTML = lines.map(line => `<div>${line.replace(/ /g, '\u00a0') || '\u00a0'}</div>`).join('');
        message.textContent = '';
        fileInfo.textContent = `${folder}`;
        mainContent.classList.remove('hidden-content'); // Show main content
    } catch (error) {
        message.textContent = `Error: ${error.message}`;
        lineNumbers.textContent = '';
        codeContent.textContent = '';
        fileInfo.textContent = '';
        mainContent.classList.add('hidden-content'); // Hide main content on error
    }
}

document.querySelectorAll('.file-structure li[data-url]').forEach(fileElement => {
    fileElement.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = fileElement.getAttribute('data-url');
        const folder = fileElement.getAttribute('data-folder');
        const name = fileElement.textContent;
        fetchAndDisplayCode(url, folder, name);
    });
});

document.querySelectorAll('.file-structure .folder').forEach(folderElement => {
    folderElement.addEventListener('click', (e) => {
        e.stopPropagation();
        folderElement.classList.toggle('expanded');
        const nestedUl = folderElement.querySelector('ul');
        if (nestedUl) {
            nestedUl.classList.toggle('hidden');
        }
    });
});

// Initially hide the main content
document.querySelector('.main-content').classList.add('hidden-content');