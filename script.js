const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Floating background hearts/particles
class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.03;
    }
    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.angle) * 0.5 + this.speedX;
        this.angle += this.spin;
        if (this.y < -20) {
            this.reset();
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = `rgba(255, 51, 102, ${this.opacity})`;
        ctx.shadowColor = '#ff3366';
        ctx.shadowBlur = 10;
        
        // Draw heart shape
        ctx.beginPath();
        let s = this.size;
        ctx.moveTo(0, s / 4);
        ctx.bezierCurveTo(-s, -s / 2, -s, s, 0, s * 1.2);
        ctx.bezierCurveTo(s, s, s, -s / 2, 0, s / 4);
        ctx.fill();
        ctx.restore();
    }
}

// Growing Flowers
class Flower {
    constructor(x, targetHeight, delay) {
        this.x = x;
        this.startY = canvas.height;
        this.targetY = canvas.height - targetHeight;
        this.currentY = this.startY;
        this.delay = delay;
        this.timer = 0;
        this.growthSpeed = 2.5;
        this.bloomProgress = 0;
        this.maxRadius = Math.random() * 15 + 25;
        this.petals = Math.floor(Math.random() * 2) + 5;
    }

    update() {
        if (this.timer < this.delay) {
            this.timer++;
            return;
        }

        if (this.currentY > this.targetY) {
            this.currentY -= this.growthSpeed;
        } else {
            if (this.bloomProgress < 1) {
                this.bloomProgress += 0.02;
            }
        }
    }

    draw() {
        if (this.timer < this.delay) return;

        // Draw Stem
        ctx.beginPath();
        ctx.moveTo(this.x, this.startY);
        let midX = this.x + Math.sin(this.targetY * 0.01) * 15;
        ctx.quadraticCurveTo(midX, (this.startY + this.currentY) / 2, this.x, this.currentY);
        ctx.strokeStyle = '#2d6a4f';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#52b788';
        ctx.shadowBlur = 5;
        ctx.stroke();

        // Draw Flower Head once grown
        if (this.currentY <= this.targetY) {
            ctx.save();
            ctx.translate(this.x, this.currentY);
            ctx.scale(this.bloomProgress, this.bloomProgress);

            // Draw Petals
            for (let i = 0; i < this.petals; i++) {
                ctx.save();
                ctx.rotate((i * 2 * Math.PI) / this.petals);
                ctx.beginPath();
                ctx.fillStyle = '#ff3366';
                ctx.shadowColor = '#ff1a40';
                ctx.shadowBlur = 15;
                ctx.ellipse(0, -this.maxRadius * 0.6, this.maxRadius * 0.4, this.maxRadius * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Flower Center
            ctx.beginPath();
            ctx.arc(0, 0, this.maxRadius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = '#ffccd5';
            ctx.shadowColor = '#ff8fa3';
            ctx.shadowBlur = 10;
            ctx.fill();

            ctx.restore();
        }
    }
}

let particles = [];
for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
}

let flowers = [];
function initFlowers() {
    flowers = [];
    let count = 7;
    let spacing = canvas.width / (count + 1);
    for (let i = 1; i <= count; i++) {
        let x = spacing * i + (Math.random() - 0.5) * 40;
        let height = canvas.height * 0.35 + Math.random() * (canvas.height * 0.35);
        let delay = i * 25 + Math.random() * 20;
        flowers.push(new Flower(x, height, delay));
    }
}
initFlowers();

window.addEventListener('resize', () => {
    resize();
    initFlowers();
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw background floating hearts
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Update & draw growing flowers
    flowers.forEach(f => {
        f.update();
        f.draw();
    });

    requestAnimationFrame(animate);
}

animate();
