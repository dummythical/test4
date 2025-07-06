window.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  window.api.onData((data) => {
    content.textContent = data;
  });
  window.api.onError((err) => {
    content.textContent = `Error: ${err}`;
  });
});
