document.addEventListener("mousemove", (e) => {
    const dot = document.createElement("div");
    dot.classList.add("cursor-dot");

    document.body.appendChild(dot);

    dot.style.left = `${e.pageX}px`;
    dot.style.top = `${e.pageY}px`;

    setTimeout(() => {
        dot.remove();
    }, 500);
});