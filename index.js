async function fillTheTitle() {
  const post = await fetch("https://api.github.com/users/virusnest/followers").then((res) => res.json());
  document.getElementById("folowers").innerText = post.length;
  const posts = await fetch("https://api.github.com/users/virusnest/following").then((res) => res.json());
  document.getElementById("folowing").innerText = post.length;
}
fillTheTitle();
