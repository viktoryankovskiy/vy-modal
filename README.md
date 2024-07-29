# vy-modal-package

## Initialization

Initialize the modal with the following code:

```javascript
const modal = Modal({
    targetOpen: ".open-modal",
    targetClose: ".close-modal",
    animation: "fade",
    position: "center",
    modalClassName: "custom-class",
    content: <div>content<div>
});
```
Available Options

Animations: ["fade", "slideDown", "slideUp", "scale"] </br>
Positions: ["top", "center", "bottom"]

Open:</br>
```javascript
modal.open();
```
Close:</br>
```javascript
modal.close();
```
Set content:</br>
```javascript
modal.setContent(content)
```
On before open:</br>
```javascript
modal.on('before-open', (e) => {
    console.log('Before Open:', e.detail);
});
```
On after open:</br>
```javascript
modal.on('after-open', (e) => {
    console.log('After Open:', e.detail);
});
```
On before close:</br>
```javascript
modal.on('before-close', (e) => {
    console.log('Before Close:', e.detail);
});
```
On after close:</br>
```javascript
modal.on('after-close', (e) => {
  console.log('After Close:', e.detail);
});
```
Remove handle listener:</br>
```javascript
modal.off('after-open', afterOpenHandler);
```
Destroy:</br>
```javascript
modal.destroy();
```
