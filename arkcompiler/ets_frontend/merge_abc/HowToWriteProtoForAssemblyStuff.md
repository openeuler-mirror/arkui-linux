# How To Write Proto For Assembly

## 消息格式

```
syntax = "proto3" // 指定版本信息
message Test      // message为关键字，作用为定义一种消息类型
{
    string test = 1;
}
```

消息由字段组合而成
```
限定修饰符 数据类型 字段名称 = 唯一编号标签值
```

## 限定修饰符说明

### required

required 在发送消息之前必须设置该字段的值。对于接收方，必须能够识别该字段的意思。发送之前没有设置required字段或者无法识别required字段都会引发编解码异常，导致消息被丢弃。

```
syntax = "proto3"
message Test
{
    required string test = 1;
}
```

###  repeated

repeated 代表可重复，我们可以理解为数组

```
syntax = "proto3"
message Test
{
    string test = 1;
}

message TestArr
{
    repeated Test arr = 1;
}
```

### optional

optional 表示是一个可选字段，可选对于发送方，在发送消息时，可以有选择性的设置或者不设置该字段的值。如果无法识别，则忽略该字段，消息中的其它字段正常处理。

## 数据类型

| proto类型  | C++类型 | 备注 |
|:-----------|:---------------|:------------|
|double	|double	| 64位浮点数
|float	|float	| 32位浮点数
|int32	|int32	| 32位整数
|int64	|int64	| 64位整数
|uint32	|uint32	| 32位无符号整数
|uint64	|uint64	| 64位无符号整数
|sint32	|int32	| 32位整数，处理负数效率比int32更高
|sint32	|sint64	| 64位整数，处理负数效率比int64更高
|fixed32 | uint32	| 总是4个字节。如果数值总是比总是比228大的话，这个类型会比uint32高效。
|fixed64 | uint64	| 总是8个字节。如果数值总是比总是比256大的话，这个类型会比uint64高效。
|sfixed32 | int32	| 总是4个字节
|sfixed64 | int64	| 总是8个字节
|bool | bool	| 布尔类型
|string	| string	| 一个字符串必须是UTF-8编码或者7-bit ASCII编码的文本
|bytes | string	| 处理多字节的语言字符、如中文
|enum | enum	| 枚举（proto2 从1开始，proto3从0开始）
|message | object of class	| 自定义的消息类型


## 字段名称

protobuf建议以下划线命名而非驼峰式

## 唯一的编号标签

代表每个字段的一个唯一的编号标签，在同一个消息里不可以重复。这些编号标签用与在消息二进制格式中标识你的字段，并且消息一旦定义就不能更改。需要说明的是标签在1到15范围的采用一个字节进行编码，所以通常将标签1到15用于频繁发生的消息字段。编号标签大小的范围是1到229。此外不能使用protobuf系统预留的编号标签（19000 ~19999）

## import

protobuf 接口文件可以像C语言的h文件一个，分离为多个，在需要的时候通过 import导入需要对文件。其行为和C语言的#include或者java的import的行为大致相同。

## enum

```
syntax = "proto3" // 指定版本信息
enum COLOR
{
    RED = 0;
    BLUE = 1;
    YELLOW = 2;
}

message Test      // message为关键字，作用为定义一种消息类型
{
    string test = 1;
    COLOR type = 2;
}
```

## package

```
syntax = "proto3" // 指定版本信息

package tutorial;

message Test      // message为关键字，作用为定义一种消息类型
{
    string test = 1;
}
```

## oneof

message 包含许多可选字段，并且最多只能同时设置其中一个字段，则可以使用 oneof 功能强制执行此行为并节省内存

# Assembly对应Proto

## class\struct

protobuf中将类型信息结构化处理，通过自定义消息message结构对C++中class或struct进行解析处理

C++
```
struct Ins {
    size_t line_number = 0;
    uint32_t column_number = 0;
    std::string whole_line = "";  // TODO(mbolshov): redundant given file and line_number
    size_t bound_left = 0;
    size_t bound_right = 0;
}
```

proto
```
message DebuginfoIns {
    uint64 lineNumber = 1;
    uint32 columnNumber = 2;
    bytes wholeLine = 3;
    uint64 boundLeft = 4;
    uint64 boundRight = 5;
}
```


## enum

protobuf中存在enum类型，proto2 从1开始，proto3从0开始

对于Assembly中的转换，优化序列化速度，通过uint32位直接进行转换：

C++
```
class Value {
public:
    enum class Type {
        U1,
        I8,
        U8,
        I16,
        U16,
        I32,
        U32,
        I64,
        U64,
        F32,
        F64,
        STRING,
        STRING_NULLPTR,
        RECORD,
        METHOD,
        ENUM,
        ANNOTATION,
        ARRAY,
        VOID,
        METHOD_HANDLE,
        UNKNOWN		
    };
	...
}

```


proto
```
message Value {
    uint32 type = 1;
}
```
## inheritance 

protobuf中message无继承信息，开发者自己实现继承信息

C++
```
class Value {
...
}

class ArrayValue : public Value {
...
}
```

proto
```

message Value {
    uint32 type = 1;
}

message ArrayValue {
    Value father = 1;
}

```

## std::variant

通过oneof关键字实现std::variant

C++
```
std::variant<uint64_t, float, double, std::string, pandasm::Type, AnnotationData> value_;
```

proto
```
oneof value {
	uint64 valueU64 = 2;
	float valueFloat = 3;
	double valueDouble = 4;
	bytes valueStr = 5;
	Type valueType = 6;
	AnnotationData valueAnno = 7;
}
```

## unique_ptr

查看源码中的变量关系，通过oneof实现智能指针

C++
```
class Value {
}

class ArrayValue {
}

class ScalarValue {
}

std::unique_ptr<Value> value_;
```

proto
```
message Value {
}

message ScalarValue {
    Value father = 1;
}

message ArrayValue {
    Value father = 1;
}

oneof value {
	ScalarValue scalar = 2;
	ArrayValue array = 3;
}
```
