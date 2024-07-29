![image](https://github.com/user-attachments/assets/3685887d-47b5-4dc0-9b9a-6e55a7b65be1)# vy-modal-package
How to init:

 const modal = Modal({
    targetOpen: ".open-modal",
    targetClose: ".close-modal",
    animation: "fade",
    position: "center",
    content: <div>content<div>
});

animations: ["fade", "slideDown", "slideUp", "scale"],
positions: ["top", "center", "bottom"],

How to use:
-Open:
  modal.open();
-Close:
  modal.close();
-Set content:
  modal.setContent(`content`)
-On before open:
   modal.on('before-open', (e) => {
    console.log('Before Open:', e.detail);
  });
-On after open:
   modal.on('after-open', (e) => {
    console.log('After Open:', e.detail);
  });
-On before close:
  modal.on('before-close', (e) => {
    console.log('Before Close:', e.detail);
  });
-On after close:
  modal.on('after-close', (e) => {
      console.log('After Close:', e.detail);
  });
-Remove handle listener:
  modal.off('after-open', afterOpenHandler);
-Destroy:
  modal.destroy();
