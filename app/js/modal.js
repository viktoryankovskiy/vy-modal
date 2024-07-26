(function () {

    const beforeModalOpen = (modal, targetElement) =>
        new CustomEvent("before-modal-open", { detail: { modal, targetElement } });
    const afterModalOpen = (modal, targetElement) =>
        new CustomEvent("after-modal-open", { detail: { modal, targetElement } });
    const beforeModalClose = (modal) =>
        new CustomEvent("before-modal-close", { detail: { modal } });
    const afterModalClose = (modal) =>
        new CustomEvent("after-modal-close", { detail: { modal } });
    const body = document.querySelector("body");
    const optionsValues = {
        animations: ["fade", "slideDown", "slideUp", "scale"],
        positions: ["top", "center", "bottom"],
    };
    let modalID = 1;

    const createModalElements = (options) => {
        const _createdModal = document.createElement("div");
        const _createdOverlay = document.createElement("div");
        const modalClassName =
            options.modalClassName === undefined
                ? "modal"
                : `${options.modalClassName}`;

        _createdModal.classList.add(
            "modal",
            modalClassName,
            `modal-animation-${options.animation}`,
            `modal-position-${options.position}`,
        );
        _createdOverlay.classList.add("modal-overlay");

        const curId = `modal-${modalID}`;
        if (document.getElementById(curId)) {
            modalID += 1;
        }

        _createdModal.setAttribute("id", `modal-${modalID}`);
        _createdModal.innerHTML = `
        <div class="modal-window">${options.content}</div>
    `;

        return { _createdModal, _createdOverlay };
    };

    const appendModalToDOM = (_createdModal, _createdOverlay) => {
        const modalOverlay = document.getElementsByClassName("modal-overlay");
        if (modalOverlay.length < 1) {
            body.appendChild(_createdModal);
            body.appendChild(_createdOverlay);
        } else {
            modalOverlay[0].parentNode.insertBefore(_createdModal, modalOverlay[0]);
        }
    };

    const openModal = (options, targetElement) => {
        document.dispatchEvent(beforeModalOpen(options, targetElement));
        const { _createdModal, _createdOverlay } = createModalElements(options);

        appendModalToDOM(_createdModal, _createdOverlay);
        body.classList.add("modal-opened");

        const modal = document.getElementById(`modal-${modalID}`);
        const targetCloseElements = modal.querySelectorAll(options.targetClose);

        targetCloseElements.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.preventDefault();
                closeModal(options, `modal-${modalID}`);
            });
        });

        modal.addEventListener("click", (event) => {
            if (event.target.classList.contains("modal")) {
                event.preventDefault();
                closeModal(options, `modal-${modalID}`);
            }
        });

        modal.addEventListener(
            "transitionend",
            () => {
                document.dispatchEvent(afterModalOpen(options, targetElement));
            },
            { once: true },
        );

        setTimeout(() => {
            modal.classList.add("open");
        }, 0);
    };

    const closeModal = (options) => {
        const modal = document.getElementById(`modal-${modalID}`);
        if (modal) {
            modal.addEventListener(
                "transitionend",
                () => {
                    document.dispatchEvent(afterModalClose(options));
                    modal.classList.remove("hiding");
                    destroyModal(options);

                    if (modalID !== 1) {
                        modalID -= 1;
                    } else if (modalID === 1) {
                        body.classList.remove("modal-opened");
                    }
                },
                { once: true },
            );

            document.dispatchEvent(beforeModalClose(options));
            modal.classList.add("hiding");
            modal.classList.remove("open");
        }
    };

    const destroyModal = (options) => {
        const modal = document.getElementById(`modal-${modalID}`);
        const modalOverlay = document.getElementsByClassName(`modal-overlay`);

        if (modal) {
            modal.parentNode.removeChild(modal);
        }

        if (modalID === 1 && modalOverlay.length > 0) {
            modalOverlay[0].parentNode.removeChild(modalOverlay[0]);
            document.removeEventListener(
                "before-modal-close",
                options.beforeCloseCallback,
            );
            document.removeEventListener(
                "after-modal-close",
                options.afterCloseCallback,
            );
            document.removeEventListener(
                "before-modal-open",
                options.beforeOpenCallback,
            );
            document.removeEventListener(
                "after-modal-open",
                options.afterOpenCallback,
            );
            options._destroyed = true;
        }
    };

    const modalEventHandler = (options, eventName, cb, action) => {
        const events = {
            "before-close": "before-modal-close",
            "after-close": "after-modal-close",
            "before-open": "before-modal-open",
            "after-open": "after-modal-open",
        };

        const event = events[eventName];
        if (event) {
            if (action === "on") {
                document.addEventListener(event, cb);
            } else if (action === "off") {
                document.removeEventListener(event, cb);
            }
        } else {
            console.error(`Can't find event: ${eventName}`);
        }
    };

    const initModal = (options) => {
        if (optionsValues.animations.indexOf(options.animation) === -1) {
            console.error(`There is no "${options.animation}" effect`);
            options.animation = "fade";
        }

        if (optionsValues.positions.indexOf(options.position) === -1) {
            console.error(`There is no "${options.position}" position`);
            options.position = "top";
        }

        const targetOpenElements = document.querySelectorAll(options.targetOpen);
        targetOpenElements.forEach((element) => {
            element.addEventListener("click", (event) => {
                event.preventDefault();
                options.targetElement = element;
                openModal(options, element);
            });
        });

        if (!options._destroyed) {
            options._destroyed = false;
            options._closing = false;
        }
    };

    const Modal = (options) => {
        initModal(options);

        return {
            open: () => openModal(options, options.targetElement),
            close: () => closeModal(options),
            destroy: () => destroyModal(options),
            on: (eventName, cb) => modalEventHandler(options, eventName, cb, "on"),
            off: (eventName, cb) =>
                modalEventHandler(options, eventName, cb, "off"),
        };
    };
    window.Modal = Modal;
})();