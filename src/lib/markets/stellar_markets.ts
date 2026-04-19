/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/stellar_markets.json`.
 */
export type StellarMarkets = {
  "address": "Bcufe9vy6V3Vn4eqBQqdmRKzJgEcHdVxHci6ursiTkvi",
  "metadata": {
    "name": "stellarMarkets",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Stellar prediction markets for sky, weather, and natural events"
  },
  "instructions": [
    {
      "name": "cancelMarket",
      "docs": [
        "Cancel a market (admin only)"
      ],
      "discriminator": [
        205,
        121,
        84,
        210,
        222,
        71,
        150,
        11
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimWinnings",
      "docs": [
        "Claim winnings from a resolved or cancelled market"
      ],
      "discriminator": [
        161,
        215,
        24,
        59,
        14,
        236,
        242,
        221
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "market",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "marketVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "userPosition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userTokenAccount",
          "docs": [
            "User's token account"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createMarket",
      "docs": [
        "Create a new prediction market"
      ],
      "discriminator": [
        103,
        226,
        97,
        235,
        200,
        188,
        251,
        254
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true
        },
        {
          "name": "marketVault",
          "docs": [
            "Market vault for holding tokens"
          ],
          "writable": true
        },
        {
          "name": "tokenMint",
          "docs": [
            "Token mint"
          ]
        },
        {
          "name": "creatorTokenAccount",
          "docs": [
            "Creator's token account (for fee payment)"
          ],
          "writable": true
        },
        {
          "name": "feeRecipientTokenAccount",
          "docs": [
            "Fee recipient's token account"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "question",
          "type": "string"
        },
        {
          "name": "resolutionTime",
          "type": "i64"
        },
        {
          "name": "feeAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "docs": [
        "Initialize the prediction market program"
      ],
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "docs": [
            "The SPL token mint for betting"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feeRecipient",
          "type": "pubkey"
        },
        {
          "name": "maxFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "pause",
      "docs": [
        "Pause the contract (admin only)"
      ],
      "discriminator": [
        211,
        22,
        221,
        251,
        74,
        121,
        193,
        47
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "placeBet",
      "docs": [
        "Place a bet on a market"
      ],
      "discriminator": [
        222,
        62,
        67,
        220,
        63,
        166,
        126,
        33
      ],
      "accounts": [
        {
          "name": "bettor",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "marketVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        },
        {
          "name": "userPosition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  115,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              },
              {
                "kind": "account",
                "path": "bettor"
              }
            ]
          }
        },
        {
          "name": "bettorTokenAccount",
          "docs": [
            "Bettor's token account"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "outcome",
          "type": {
            "defined": {
              "name": "outcome"
            }
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveMarket",
      "docs": [
        "Resolve a market (admin only)"
      ],
      "discriminator": [
        155,
        23,
        80,
        173,
        46,
        74,
        23,
        239
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "marketId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "marketId",
          "type": "u64"
        },
        {
          "name": "winningOutcome",
          "type": {
            "defined": {
              "name": "outcome"
            }
          }
        }
      ]
    },
    {
      "name": "unpause",
      "docs": [
        "Unpause the contract (admin only)"
      ],
      "discriminator": [
        169,
        144,
        4,
        38,
        10,
        141,
        188,
        255
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "updateConfig",
      "docs": [
        "Update the global configuration (admin only)"
      ],
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "feeRecipient",
          "type": "pubkey"
        },
        {
          "name": "maxFeeBps",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "market",
      "discriminator": [
        219,
        190,
        213,
        55,
        0,
        227,
        198,
        154
      ]
    },
    {
      "name": "userPosition",
      "discriminator": [
        251,
        248,
        209,
        245,
        83,
        234,
        17,
        27
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "paused",
      "msg": "Contract is paused"
    },
    {
      "code": 6001,
      "name": "notPaused",
      "msg": "Contract is not paused"
    },
    {
      "code": 6002,
      "name": "invalidAdmin",
      "msg": "Invalid admin"
    },
    {
      "code": 6003,
      "name": "invalidFee",
      "msg": "Invalid fee percentage"
    },
    {
      "code": 6004,
      "name": "invalidResolutionTime",
      "msg": "Invalid resolution time"
    },
    {
      "code": 6005,
      "name": "emptyQuestion",
      "msg": "Empty question"
    },
    {
      "code": 6006,
      "name": "questionTooLong",
      "msg": "Question too long"
    },
    {
      "code": 6007,
      "name": "marketNotFound",
      "msg": "Market not found"
    },
    {
      "code": 6008,
      "name": "marketNotActive",
      "msg": "Market not active"
    },
    {
      "code": 6009,
      "name": "marketAlreadyFinalized",
      "msg": "Market already finalized"
    },
    {
      "code": 6010,
      "name": "marketNotFinalized",
      "msg": "Market not finalized"
    },
    {
      "code": 6011,
      "name": "marketExpired",
      "msg": "Market expired"
    },
    {
      "code": 6012,
      "name": "marketNotExpired",
      "msg": "Market not expired"
    },
    {
      "code": 6013,
      "name": "invalidOutcome",
      "msg": "Invalid outcome"
    },
    {
      "code": 6014,
      "name": "noOpposition",
      "msg": "No opposition in market"
    },
    {
      "code": 6015,
      "name": "zeroAmount",
      "msg": "Zero amount"
    },
    {
      "code": 6016,
      "name": "noPosition",
      "msg": "No position"
    },
    {
      "code": 6017,
      "name": "alreadyClaimed",
      "msg": "Already claimed"
    },
    {
      "code": 6018,
      "name": "overflow",
      "msg": "Overflow error"
    }
  ],
  "types": [
    {
      "name": "config",
      "docs": [
        "Global configuration account for the prediction market"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "feeRecipient",
            "docs": [
              "Fee recipient"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "docs": [
              "SPL token mint for betting"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenDecimals",
            "docs": [
              "Token decimals"
            ],
            "type": "u8"
          },
          {
            "name": "maxFeeBps",
            "docs": [
              "Max fee percentage in basis points (100 = 1%)"
            ],
            "type": "u16"
          },
          {
            "name": "marketCounter",
            "docs": [
              "Total markets created"
            ],
            "type": "u64"
          },
          {
            "name": "paused",
            "docs": [
              "Paused flag"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "market",
      "docs": [
        "Market account storing all market data"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Unique market ID"
            ],
            "type": "u64"
          },
          {
            "name": "question",
            "docs": [
              "Market question (max 200 chars)"
            ],
            "type": "string"
          },
          {
            "name": "resolutionTime",
            "docs": [
              "Resolution time (unix timestamp)"
            ],
            "type": "i64"
          },
          {
            "name": "state",
            "docs": [
              "Current market state"
            ],
            "type": {
              "defined": {
                "name": "marketState"
              }
            }
          },
          {
            "name": "winningOutcome",
            "docs": [
              "Winning outcome (if resolved)"
            ],
            "type": {
              "defined": {
                "name": "outcome"
              }
            }
          },
          {
            "name": "yesPool",
            "docs": [
              "Total YES pool amount"
            ],
            "type": "u64"
          },
          {
            "name": "noPool",
            "docs": [
              "Total NO pool amount"
            ],
            "type": "u64"
          },
          {
            "name": "creationFee",
            "docs": [
              "Creation fee paid"
            ],
            "type": "u64"
          },
          {
            "name": "creator",
            "docs": [
              "Market creator"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Created at timestamp"
            ],
            "type": "i64"
          },
          {
            "name": "configFeeRecipient",
            "docs": [
              "Config snapshot - fee recipient"
            ],
            "type": "pubkey"
          },
          {
            "name": "configMaxFeeBps",
            "docs": [
              "Config snapshot - max fee bps"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "docs": [
              "Vault bump seed"
            ],
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "marketState",
      "docs": [
        "Market state enum"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "resolved"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "outcome",
      "docs": [
        "Outcome enum"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "none"
          },
          {
            "name": "yes"
          },
          {
            "name": "no"
          }
        ]
      }
    },
    {
      "name": "userPosition",
      "docs": [
        "User position in a market"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "marketId",
            "docs": [
              "Market ID"
            ],
            "type": "u64"
          },
          {
            "name": "user",
            "docs": [
              "User pubkey"
            ],
            "type": "pubkey"
          },
          {
            "name": "yesBet",
            "docs": [
              "Amount bet on YES"
            ],
            "type": "u64"
          },
          {
            "name": "noBet",
            "docs": [
              "Amount bet on NO"
            ],
            "type": "u64"
          },
          {
            "name": "claimed",
            "docs": [
              "Has user claimed"
            ],
            "type": "bool"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
