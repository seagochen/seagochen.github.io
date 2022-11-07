const easyMDE = new EasyMDE({
    element: document.getElementById('editor'),
    minHeight: "500px",
    maxHeight: "500px",
    autofocus: true,
    autosave: {
        enabled: true,
        uniqueId: "MyUniqueID",
        delay: 1000,
        submit_delay: 5000,
        timeFormat: {
            locale: 'en-US',
            format: {
                year: 'numeric',
                month: 'long',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            },
        },
        text: "Autosaved: "
    },
    placeholder: "Type your markdown here...",
    toolbar: [
        {   // New a markdown file
            name: "new",
            action: (editor) => {
                editor.value("");
            },
            className: "fa fa-file",
            title: "New",
        },

        {   // Open a markdown file from the local
            name: "open",
            action: (editor) => {
                var file = document.createElement('input');
                file.type = 'file';
                file.onchange = e => {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.readAsText(file, "UTF-8");
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result;
                        editor.value(content);
                    }
                }
                file.click();
            },
            className: "fa fa-folder-open",
            title: "Open",
        },

        {   // Save the markdown file to the local
            name: "save",
            action: (editor) => {
                var content = editor.value();
                var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
                saveAs(blob, "untitled.md");
            },
            className: "fa fa-save",
            title: "Save",
        },

        {   // Publish
            name: "publish",
            action: (editor) => {
                // The function that will be executed when the button is clicked
                // The editor parameter is the current instance of EasyMDE

                //TODO
                var content = editor.value();
                console.log(content);
            },
            className: "fa fa-cloud-arrow-up", 
            title: "Publish",
        },
        "|", "bold", "italic",
        {
            name: "heading",
            className: "fa fa-heading",
            title: "Heading",
            children: ["heading-1", "heading-2", "heading-3"]
        },
        {
            name: "insert",
            className: "fa fa-chart-bar",
            title: "Insert Elements",
            children: ["upload-image", "code", "quote", "link", "table","unordered-list", "ordered-list",]
        }, "|", "preview", "side-by-side", "fullscreen", "|", "guide", "undo", "redo"]
});