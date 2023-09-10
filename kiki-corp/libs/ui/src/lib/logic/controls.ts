export class Controls {
    public left: boolean = false;
    public right: boolean = false;
    public forward: boolean = false;
    public reverse: boolean = false;

    constructor(type: string) {
        switch (type) {
            case 'KEY':
                this.addKeyListeners();
                this.addClickListeners();
                break;
            case 'AI':
                break;
        }
    }

    private addKeyListeners() {
        document.addEventListener('keydown', (event) => {

            switch (event.key) {
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
            }
        });
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
            }
        });
    }

    private addClickListeners() {
        // click to move
        document.addEventListener('click', (event) => {
            console.log(event.clientX, event.clientY);
        });
    }

}