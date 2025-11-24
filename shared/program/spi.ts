/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/spi.json`.
 */
export type Spi = {
  "address": "2RakX2uLr5Pm3NftQq9X8YatfqHseM8qc5J2DvvaAPDB",
  "metadata": {
    "name": "spi",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPrimeUserMerkleRootPda",
      "discriminator": [
        187,
        149,
        103,
        203,
        217,
        47,
        160,
        209
      ],
      "accounts": [
        {
          "name": "membershipRoot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114,
                  115,
                  104,
                  105,
                  112,
                  95,
                  114,
                  111,
                  111,
                  116,
                  95,
                  115,
                  112,
                  105,
                  95,
                  116,
                  114,
                  105,
                  97,
                  108,
                  95,
                  50,
                  52
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "merkleRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "createToken",
      "discriminator": [
        84,
        52,
        204,
        228,
        24,
        140,
        234,
        75
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "spiAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  105,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "spiMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "metadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "const",
                "value": [
                  11,
                  112,
                  101,
                  177,
                  227,
                  209,
                  124,
                  69,
                  56,
                  157,
                  82,
                  127,
                  107,
                  4,
                  195,
                  205,
                  88,
                  184,
                  108,
                  115,
                  26,
                  160,
                  253,
                  181,
                  73,
                  182,
                  209,
                  188,
                  3,
                  248,
                  41,
                  70
                ]
              },
              {
                "kind": "account",
                "path": "spiMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                11,
                112,
                101,
                177,
                227,
                209,
                124,
                69,
                56,
                157,
                82,
                127,
                107,
                4,
                195,
                205,
                88,
                184,
                108,
                115,
                26,
                160,
                253,
                181,
                73,
                182,
                209,
                188,
                3,
                248,
                41,
                70
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        }
      ]
    },
    {
      "name": "createUserAsa",
      "discriminator": [
        195,
        151,
        45,
        184,
        111,
        239,
        112,
        147
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "customer"
        },
        {
          "name": "userAsa",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  97,
                  115,
                  97,
                  95,
                  115,
                  112,
                  105,
                  95,
                  116,
                  114,
                  105,
                  97,
                  108,
                  95,
                  50,
                  52
                ]
              },
              {
                "kind": "account",
                "path": "customer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "merkleProof",
          "type": {
            "vec": {
              "array": [
                "u8",
                32
              ]
            }
          }
        },
        {
          "name": "validTillUnixTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mainTransfer",
      "discriminator": [
        78,
        85,
        113,
        224,
        103,
        105,
        7,
        63
      ],
      "accounts": [
        {
          "name": "sender",
          "docs": [
            "Customer paying SOL and spending/earning loyalty tokens"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "spiAuthority",
          "docs": [
            "PDA that is the mint authority for the SPI token"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  105,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "spiMint",
          "writable": true
        },
        {
          "name": "senderAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "sender"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "spiMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "mintAmount",
          "type": "u64"
        },
        {
          "name": "percentageOff",
          "type": "u8"
        }
      ]
    },
    {
      "name": "membership",
      "discriminator": [
        209,
        176,
        34,
        171,
        191,
        134,
        26,
        38
      ],
      "accounts": [
        {
          "name": "sender",
          "writable": true,
          "signer": true
        },
        {
          "name": "merchant",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updatePrimeUserMerkleTreePda",
      "discriminator": [
        173,
        50,
        155,
        227,
        210,
        56,
        68,
        155
      ],
      "accounts": [
        {
          "name": "membershipRoot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  109,
                  98,
                  101,
                  114,
                  115,
                  104,
                  105,
                  112,
                  95,
                  114,
                  111,
                  111,
                  116,
                  95,
                  115,
                  112,
                  105,
                  95,
                  116,
                  114,
                  105,
                  97,
                  108,
                  95,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "newMerkleRoot",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "updateUserAsaData",
      "discriminator": [
        194,
        185,
        102,
        80,
        26,
        109,
        247,
        17
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "customer"
        },
        {
          "name": "userAsa",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  97,
                  115,
                  97,
                  95,
                  115,
                  112,
                  105,
                  95,
                  116,
                  114,
                  105,
                  97,
                  108,
                  95,
                  50,
                  52
                ]
              },
              {
                "kind": "account",
                "path": "customer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "isValid",
          "type": {
            "option": "bool"
          }
        },
        {
          "name": "spiTokens",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "totalCashback",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "totalSpent",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "totalTransactions",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "validTillUnixTimestamp",
          "type": {
            "option": "u64"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "createPrimeUsersMerkleTreePda",
      "discriminator": [
        76,
        244,
        123,
        215,
        169,
        8,
        170,
        88
      ]
    },
    {
      "name": "userAsa",
      "discriminator": [
        107,
        162,
        235,
        108,
        121,
        240,
        46,
        196
      ]
    }
  ],
  "events": [
    {
      "name": "spiTransferEvent",
      "discriminator": [
        93,
        193,
        102,
        115,
        251,
        36,
        30,
        163
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "You are not authorized to update the membership root."
    },
    {
      "code": 6001,
      "name": "mathOverflow",
      "msg": "Math operation overflow"
    },
    {
      "code": 6002,
      "name": "nameTooLong",
      "msg": "❌ Name exceeds maximum length allowed."
    },
    {
      "code": 6003,
      "name": "merkleProofTooLarge",
      "msg": "❌ Merkle proof exceeds maximum length allowed."
    }
  ],
  "types": [
    {
      "name": "createPrimeUsersMerkleTreePda",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "merkleRoot",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "spiTransferEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sender",
            "type": "pubkey"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          },
          {
            "name": "feeCollector",
            "type": "pubkey"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "recipientAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userAsa",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "spiTokens",
            "type": "u64"
          },
          {
            "name": "isValid",
            "type": "bool"
          },
          {
            "name": "totalCashback",
            "type": "u64"
          },
          {
            "name": "validTillUnixTimestamp",
            "type": "u64"
          },
          {
            "name": "joinDateUnixTimestamp",
            "type": "u64"
          },
          {
            "name": "totalSpent",
            "type": "u64"
          },
          {
            "name": "totalTransactions",
            "type": "u64"
          },
          {
            "name": "merkleProof",
            "type": {
              "vec": {
                "array": [
                  "u8",
                  32
                ]
              }
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "membershipRootSeed",
      "type": "bytes",
      "value": "[109, 101, 109, 98, 101, 114, 115, 104, 105, 112, 95, 114, 111, 111, 116, 95, 115, 112, 105, 95, 116, 114, 105, 97, 108, 95, 50, 52]"
    },
    {
      "name": "metadataSeed",
      "type": "bytes",
      "value": "[109, 101, 116, 97, 100, 97, 116, 97]"
    },
    {
      "name": "spiMintAuthoritySeed",
      "type": "bytes",
      "value": "[115, 112, 105, 95, 109, 105, 110, 116, 95, 97, 117, 116, 104, 111, 114, 105, 116, 121]"
    },
    {
      "name": "spiTokenDecimals",
      "type": "u8",
      "value": "1"
    },
    {
      "name": "userAsaSeed",
      "type": "bytes",
      "value": "[117, 115, 101, 114, 95, 97, 115, 97, 95, 115, 112, 105, 95, 116, 114, 105, 97, 108, 95, 50, 52]"
    }
  ]
};
