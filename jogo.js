const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//[PLano de fundo]
const planoDeFundo = {
	spriteX: 390,
	spriteY: 0,
	largura: 275,
	altura: 204,
	x: 0,
	y: canvas.height - 204,
	desenha() {
		contexto.fillStyle = '#70c5ce';
		contexto.fillRect(0, 0, canvas.width, canvas.height)

		contexto.drawImage(
			sprites,
			planoDeFundo.spriteX, planoDeFundo.spriteY,
			planoDeFundo.largura, planoDeFundo.altura,
			planoDeFundo.x, planoDeFundo.y,
			planoDeFundo.largura, planoDeFundo.altura,
		);
		contexto.drawImage(
			sprites,
			planoDeFundo.spriteX, planoDeFundo.spriteY,
			planoDeFundo.largura, planoDeFundo.altura,
			(planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
			planoDeFundo.largura, planoDeFundo.altura,
		);
	}
}

//[Chão]
const chao = {
	spriteX: 0,
	spriteY: 610,
	largura: 224,
	altura: 122,
	x: 0,
	y: canvas.height -112,
	desenha() {
		contexto.drawImage(
			sprites,
			chao.spriteX, chao.spriteY,
			chao.largura, chao.altura,
			chao.x, chao.y,
			chao.largura, chao.altura,
		);

		contexto.drawImage(
			sprites,
			chao.spriteX, chao.spriteY,
			chao.largura, chao.altura,
			(chao.x + chao.largura), chao.y,
			chao.largura, chao.altura,
		);
	}
}

//[Bird]
const flappybird = {
	spriteX: 0,
	spriteY: 0,
	largura: 33,
	altura: 24,
	x: 10,
	y: 50,
	pulo: 4.6,
	gravidade: 0.25,
	velocidade: 0,

	pula() {
		flappybird.velocidade = - flappybird.pulo;
	},
	
	atualiza() {
		flappybird.velocidade = flappybird.velocidade + flappybird.gravidade;
		flappybird.y = flappybird.y + flappybird.velocidade;
	},
	
	desenha() {
		contexto.drawImage(
			sprites, 
			flappybird.spriteX, flappybird.spriteY,
			flappybird.largura, flappybird.altura,
			flappybird.x, flappybird.y,
			flappybird.largura, flappybird.altura,
		);
	}
}

//[Abertura]
const abertura = {
	sx: 134, 
	sy: 0,
	w: 174,
	h: 152,
	x: (canvas.width / 2) - 174 / 2,
	y: 50,
	desenha() {
		contexto.drawImage(
			sprites,
			abertura.sx, abertura.sy,
			abertura.w, abertura.h,
			abertura.x, abertura.y,
			abertura.w, abertura.h
			);
	}
}

// TELAS
let telaAtiva = {};

function mudaParaTela(novaTela) {
	telaAtiva = novaTela;
}

const telas = {
	inicio: {
		desenha() {
			planoDeFundo.desenha();
			chao.desenha();
			flappybird.desenha();	
			abertura.desenha();
		},

		click() {
			mudaParaTela(telas.JOGO);
		},

		atualiza() {

		}
	}
}

telas.JOGO = {
	desenha() {
		planoDeFundo.desenha();
		chao.desenha();
		flappybird.desenha();	
	},
	click() {
		flappybird.pula();
	},
	atualiza() {
		flappybird.atualiza();
	}
}

function loop() {

	telaAtiva.desenha();
	telaAtiva.atualiza();

	
	requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
	if (telaAtiva.click) {
		telaAtiva.click();
	}
});

mudaParaTela(telas.inicio);
loop();