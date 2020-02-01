'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			primaryKey: true
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [2,55]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'O e-mail informado é inválido.'
        }
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    ultimo_login: {
      type: DataTypes.DATE,
      defaultValue: null
    },
    nome_completo: {
      type: DataTypes.STRING
    },
    cpf: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg:'O CPF informado deve conter apenas números sem pontuações ou traços.'
        }
      }
    },
    cep: {
      type: DataTypes.STRING,
      validate: {
        isNumeric: {
          msg:'O CEP deve conter apenas números sem puntuações ou traços.'
        }
      }
    },
    logradouro: {
      type: DataTypes.STRING
    },
    complemento: {
      type: DataTypes.STRING
    },
    bairro: {
      type: DataTypes.STRING
    },
    localidade: {
      type: DataTypes.STRING
    },
    uf: {
      type: DataTypes.STRING
    },
    unidade: {
      type: DataTypes.STRING
    },
    cartao: {
      type: DataTypes.STRING,
      validade: {
        isCreditCard: {
          msg: 'O cartão informado é inválido.'
        }
      }
    }
  }, {});
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};