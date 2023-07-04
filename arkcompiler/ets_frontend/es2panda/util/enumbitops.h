/*
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

#ifndef ES2PANDA_UTIL_INCLUDE_ENUM_BITOPS_H
#define ES2PANDA_UTIL_INCLUDE_ENUM_BITOPS_H

#include <type_traits>

#define DEFINE_BITOPS(T)                                                          \
    inline T operator~(T a)                                                       \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return static_cast<T>(~static_cast<utype>(a));                            \
    }                                                                             \
                                                                                  \
    inline bool operator!(T a)                                                    \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return (!static_cast<utype>(a));                                          \
    }                                                                             \
                                                                                  \
    inline T operator|(T a, T b)                                                  \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return static_cast<T>(static_cast<utype>(a) | static_cast<utype>(b));     \
    }                                                                             \
                                                                                  \
    inline std::underlying_type_t<T> operator&(T a, T b)                          \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return static_cast<utype>(static_cast<utype>(a) & static_cast<utype>(b)); \
    }                                                                             \
                                                                                  \
    inline T operator^(T a, T b)                                                  \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return static_cast<T>(static_cast<utype>(a) ^ static_cast<utype>(b));     \
    }                                                                             \
                                                                                  \
    inline T &operator|=(T &a, T b)                                               \
    {                                                                             \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return a = a | b;                                                         \
    }                                                                             \
                                                                                  \
    inline T &operator&=(T &a, T b)                                               \
    {                                                                             \
        using utype = std::underlying_type_t<T>;                                  \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return a = static_cast<T>(static_cast<utype>(a) & static_cast<utype>(b)); \
    }                                                                             \
                                                                                  \
    inline T &operator^=(T &a, T b)                                               \
    {                                                                             \
        /* NOLINTNEXTLINE(hicpp-signed-bitwise) */                                \
        return a = a ^ b;                                                         \
    }

#endif
