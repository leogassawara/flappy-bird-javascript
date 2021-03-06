console.log('Bem vindo ao Flappy Bird by_Oga!')

let frames = 0;

const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';


const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//[Plano de fundo]
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
function criaChao() {
	const chao = {
		spriteX: 0,
		spriteY: 610,
		largura: 224,
		altura: 122,
		x: 0,
		y: canvas.height -112,
		
		atualiza() {
			const movimentoDoChao = 1;
			const repeteEm = chao.largura /2;
			const movimentacao = chao.x - movimentoDoChao;

			//console.log('[chao.x]', chao.x);
			//console.log('[repeteEm]', repeteEm);
			//console.log('[movimentacao]', movimentacao % repeteEm);

			chao.x = movimentacao % repeteEm;
		},

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
		},
	}
	return chao;
}

function fazColisao(flappybird, chao) {
	const flappybirdY = flappybird.y + flappybird.altura;
	const chaoY = chao.y;

	if(flappybirdY >= chaoY) {
		return true;
	}

	return false;
}

//[Bird]
function criaFlappyBird() {
	const flappybird = {
		spriteX: 0,
		spriteY: 0,
		largura: 33,
		altura: 24,
		x: 10,
		y: 50,
		pulo: 4.6,
		pula() {
			console.log('Devo pular');
			console.log('[ANTES]', flappybird.velocidade);
			flappybird.velocidade = - flappybird.pulo;
			console.log('[DEPOIS]', flappybird.velocidade);
		},

		gravidade: 0.25,
		velocidade: 0,
		
		atualiza() {
			if (fazColisao(flappybird, globais.chao)) {
				console.log('Fez colisao');
				som_HIT.play();

				setTimeout(() => {
					mudaParaTela(telas.inicio);
				}, 500);
				return;
			}

			flappybird.velocidade = flappybird.velocidade + flappybird.gravidade;
			flappybird.y = flappybird.y + flappybird.velocidade;
		},
		
		movimentos: [
			{spriteX: 0, spriteY: 0,},
			{spriteX: 0, spriteY: 26,},
			{spriteX: 0, spriteY: 52,},
		],

		frameAtual: 0,
		atualizaOFrameAtual() {
			const intervaloDeFrames = 10;

			const passouOIntervalo = frames % intervaloDeFrames == 0;

			if (passouOIntervalo) {
				//console.log(frames);
				const baseDoIncremento = 1;
				const incremento = baseDoIncremento + flappybird.frameAtual;
				const baseRepeticao = flappybird.movimentos.length;
				flappybird.frameAtual = incremento % baseRepeticao
			}
				//console.log('[incremento]', incremento);
				//console.log('[baseRepeticao]', baseRepeticao);
				//console.log('[frame]', incremento % baseRepeticao);
		},

		desenha() {
			flappybird.atualizaOFrameAtual();
			const { spriteX, spriteY } = flappybird.movimentos[flappybird.frameAtual];

			contexto.drawImage(
				sprites, 
				spriteX, spriteY,
				flappybird.largura, flappybird.altura,
				flappybird.x, flappybird.y,
				flappybird.largura, flappybird.altura,
			);
		}
	}
	return flappybird;
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
const globais = {};

let telaAtiva = {};

function mudaParaTela(novaTela) {
	telaAtiva = novaTela;

	if (telaAtiva.inicializa) {
		telaAtiva.inicializa();
	}
}

const telas = {
	inicio: {
		inicializa() {
			globais.flappybird = criaFlappyBird();
			globais.chao = criaChao();
		},
		desenha() {
			planoDeFundo.desenha();
			globais.chao.desenha();
			globais.flappybird.desenha();	
			abertura.desenha();
		},

		click() {
			mudaParaTela(telas.JOGO);
		},

		atualiza() {
			globais.chao.atualiza();
		}
	}
};

telas.JOGO = {
	desenha() {
		planoDeFundo.desenha();
		globais.chao.desenha();
		globais.flappybird.desenha();	
	},
	click() {
		globais.flappybird.pula();
	},
	atualiza() {
		globais.flappybird.atualiza();
		globais.chao.atualiza();
	}
}

function loop() {

	telaAtiva.desenha();
	telaAtiva.atualiza();

	frames = frames + 1;
	requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
	if (telaAtiva.click) {
		telaAtiva.click();
	}
});

mudaParaTela(telas.inicio);
loop();