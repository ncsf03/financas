CREATE DATABASE financas;
USE financas; 

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    saldo DECIMAL(0,00),
    usuario VARCHAR(55) NOT NULL,
    senha VARCHAR(55) NOT NULL
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    categoria_id INT,
    descricao VARCHAR(100),
    valor DECIMAL(10,2) NOT NULL,
    data_gasto DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE transacoes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo ENUM('entrada', saida) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    descricao VARCHAR(100),
    data_transacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

INSERT INTO categorias (nome) VALUES
('Alimentação'),
('Transporte'),
('Lazer'),
('Saúde'),
('Educação'),
('Contas'),
('Moradia'),
('Compras'),
('Viagem'),
('Outros');