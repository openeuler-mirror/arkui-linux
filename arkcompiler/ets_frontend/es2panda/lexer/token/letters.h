/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef ES2PANDA_PARSER_CORE_LETTERS_H
#define ES2PANDA_PARSER_CORE_LETTERS_H

namespace panda::es2panda::lexer {

#define LEX_ASCII_MAX_BITS 128

#define LEX_CHAR_NULL 0x00 /* \0 */

// Line Terminators
#define LEX_CHAR_LF 0x0A   /* line feed */
#define LEX_CHAR_CR 0x0D   /* carriage return */
#define LEX_CHAR_LS 0x2028 /* line separator */
#define LEX_CHAR_PS 0x2029 /* paragraph separator */

#define LEX_CHAR_LOWERCASE_A 0x61 /* a */
#define LEX_CHAR_LOWERCASE_B 0x62 /* b */
#define LEX_CHAR_LOWERCASE_C 0x63 /* c */
#define LEX_CHAR_LOWERCASE_D 0x64 /* d */
#define LEX_CHAR_LOWERCASE_E 0X65 /* e */
#define LEX_CHAR_LOWERCASE_F 0X66 /* f */
#define LEX_CHAR_LOWERCASE_G 0X67 /* g */
#define LEX_CHAR_LOWERCASE_H 0X68 /* h */
#define LEX_CHAR_LOWERCASE_I 0X69 /* i */
#define LEX_CHAR_LOWERCASE_J 0X6A /* j */
#define LEX_CHAR_LOWERCASE_K 0X6B /* k */
#define LEX_CHAR_LOWERCASE_L 0X6C /* l */
#define LEX_CHAR_LOWERCASE_M 0X6D /* m */
#define LEX_CHAR_LOWERCASE_N 0X6E /* n */
#define LEX_CHAR_LOWERCASE_O 0X6F /* o */
#define LEX_CHAR_LOWERCASE_P 0x70 /* p */
#define LEX_CHAR_LOWERCASE_Q 0x71 /* q */
#define LEX_CHAR_LOWERCASE_R 0x72 /* r */
#define LEX_CHAR_LOWERCASE_S 0x73 /* s */
#define LEX_CHAR_LOWERCASE_T 0x74 /* t */
#define LEX_CHAR_LOWERCASE_U 0x75 /* u */
#define LEX_CHAR_LOWERCASE_V 0x76 /* v */
#define LEX_CHAR_LOWERCASE_W 0x77 /* W */
#define LEX_CHAR_LOWERCASE_X 0x78 /* x */
#define LEX_CHAR_LOWERCASE_Y 0x79 /* y */
#define LEX_CHAR_LOWERCASE_Z 0x7A /* z */

#define LEX_CHAR_UPPERCASE_A 0X41 /* A */
#define LEX_CHAR_UPPERCASE_B 0X42 /* B */
#define LEX_CHAR_UPPERCASE_C 0X43 /* C */
#define LEX_CHAR_UPPERCASE_D 0X44 /* B */
#define LEX_CHAR_UPPERCASE_E 0X45 /* E */
#define LEX_CHAR_UPPERCASE_F 0X46 /* F */
#define LEX_CHAR_UPPERCASE_G 0X47 /* G */
#define LEX_CHAR_UPPERCASE_H 0X48 /* H */
#define LEX_CHAR_UPPERCASE_I 0X49 /* I */
#define LEX_CHAR_UPPERCASE_J 0X4A /* J */
#define LEX_CHAR_UPPERCASE_K 0X4B /* K */
#define LEX_CHAR_UPPERCASE_L 0X4C /* L */
#define LEX_CHAR_UPPERCASE_M 0X4D /* M */
#define LEX_CHAR_UPPERCASE_N 0X4E /* N */
#define LEX_CHAR_UPPERCASE_O 0X4F /* O */
#define LEX_CHAR_UPPERCASE_P 0X50 /* P */
#define LEX_CHAR_UPPERCASE_Q 0X51 /* Q */
#define LEX_CHAR_UPPERCASE_R 0X52 /* R */
#define LEX_CHAR_UPPERCASE_S 0X53 /* S */
#define LEX_CHAR_UPPERCASE_T 0X54 /* T */
#define LEX_CHAR_UPPERCASE_U 0X55 /* U */
#define LEX_CHAR_UPPERCASE_V 0X56 /* V */
#define LEX_CHAR_UPPERCASE_W 0X57 /* W */
#define LEX_CHAR_UPPERCASE_X 0x58 /* X */
#define LEX_CHAR_UPPERCASE_Y 0x59 /* Y */
#define LEX_CHAR_UPPERCASE_Z 0x5A /* Z */

#define LEX_CHAR_BS 0x08           /* backspace */
#define LEX_CHAR_TAB 0x09          /* character tabulation */
#define LEX_CHAR_VT 0x0B           /* liner tabulation */
#define LEX_CHAR_FF 0x0C           /* form feed */
#define LEX_CHAR_SP 0x20           /* space */
#define LEX_CHAR_NBSP 0xA0         /* no-break space */
#define LEX_CHAR_ZWNBSP 0xFEFF     /* zero width no-break space */
#define LEX_CHAR_IGSP 0x3000       /* ideographic space */
#define LEX_CHAR_MVS 0x180e        /* MONGOLIAN VOWEL SEPARATOR (U+180E) */
#define LEX_CHAR_DOUBLE_QUOTE 0x22 /* " */
#define LEX_CHAR_DOLLAR_SIGN 0x24  /* $ */
#define LEX_CHAR_SINGLE_QUOTE 0x27 /* ' */
#define LEX_CHAR_DOT 0x2E          /* . */
#define LEX_CHAR_NLINE 0x85        /* nextline */

#define LEX_CHAR_0 0x30 /* 0 */
#define LEX_CHAR_1 0x31 /* 1 */
#define LEX_CHAR_2 0x32 /* 2 */
#define LEX_CHAR_3 0x33 /* 3 */
#define LEX_CHAR_4 0x34 /* 4 */
#define LEX_CHAR_5 0x35 /* 5 */
#define LEX_CHAR_6 0x36 /* 6 */
#define LEX_CHAR_7 0x37 /* 7 */
#define LEX_CHAR_8 0x38 /* 8 */
#define LEX_CHAR_9 0x39 /* 9 */

#define LEX_CHAR_BACKSLASH 0X5c  /* \\ */
#define LEX_CHAR_UNDERSCORE 0x5F /* _ */

// Punctuator characters
#define LEX_CHAR_EXCLAMATION 0x21  /* exclamation mark */
#define LEX_CHAR_PERCENT 0x25      /* percent sign */
#define LEX_CHAR_AMPERSAND 0x26    /* ampersand */
#define LEX_CHAR_LEFT_PAREN 0x28   /* left parenthesis */
#define LEX_CHAR_RIGHT_PAREN 0x29  /* right parenthesis */
#define LEX_CHAR_ASTERISK 0x2A     /* asterisk */
#define LEX_CHAR_PLUS 0x2B         /* plus sign */
#define LEX_CHAR_COMMA 0x2C        /* comma */
#define LEX_CHAR_PLUS 0x2B         /* plus */
#define LEX_CHAR_MINUS 0x2D        /* hyphen-minus */
#define LEX_CHAR_DOT 0x2E          /* dot */
#define LEX_CHAR_SLASH 0x2F        /* solidus */
#define LEX_CHAR_COLON 0x3A        /* colon */
#define LEX_CHAR_SEMICOLON 0x3B    /* semicolon */
#define LEX_CHAR_LESS_THAN 0x3C    /* less-than sign */
#define LEX_CHAR_EQUALS 0x3D       /* equals sign */
#define LEX_CHAR_GREATER_THAN 0x3E /* greater-than sign */
#define LEX_CHAR_QUESTION 0x3F     /* question mark */
#define LEX_CHAR_LEFT_SQUARE 0x5B  /* left square bracket */
#define LEX_CHAR_RIGHT_SQUARE 0x5D /* right square bracket */
#define LEX_CHAR_CIRCUMFLEX 0x5E   /* circumflex accent */
#define LEX_CHAR_LEFT_BRACE 0x7B   /* left curly bracket */
#define LEX_CHAR_VLINE 0x7C        /* vertical line */
#define LEX_CHAR_RIGHT_BRACE 0x7D  /* right curly bracket */
#define LEX_CHAR_TILDE 0x7E        /* tilde */
#define LEX_CHAR_BACK_TICK 0x60    /* back tick */
#define LEX_CHAR_HASH_MARK 0x23    /* hash mark */
#define LEX_CHAR_AT 0x40           /* at */

#define LEX_CHAR_ZWNJ 0x200C /* zero width non-joiner */
#define LEX_CHAR_ZWJ 0x200D  /* zero width joiner */

#define LEX_VERTICAL_TILDE 0x2E2F /* vertical tilde */

#define LEX_TO_ASCII_LOWERCASE(character) ((character) | LEX_CHAR_SP)

#define LEX_UTF8_2_BYTE_CODE_POINT_MIN (0x80)
#define LEX_UTF8_EXTRA_BYTE_MASK (0xC0)

#define LEX_CHAR_EOS 0xFFFF
#define UNICODE_CODE_POINT_MAX 0x10FFFF
#define UNICODE_INVALID_CP UINT32_MAX

}  // namespace panda::es2panda::lexer

#endif
