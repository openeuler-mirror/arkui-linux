// Copyright (c) 2021-2022 Huawei Device Co., Ltd.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as ts from "typescript";
import * as jshelpers from "./jshelpers"
import { LOGE } from "./log"
export class DiagnosticError {
  irnode:ts.Node | undefined;
  code:number;
  file: ts.SourceFile | undefined;
  args: (string | number | undefined)[];

  constructor(irnode:ts.Node | undefined, code:number, file?:ts.SourceFile | undefined, args?:(string | number | undefined)[]) {
    this.code = code
    this.irnode = irnode
    this.file = file ? file : undefined
    this.args = args ? args : []
  }
}

export function printDiagnostic(diagnostic: ts.Diagnostic) {

  let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
  if (diagnostic.file && diagnostic.start!= undefined) {
    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    LOGE(`${diagnostic.file.fileName} (${line + 1},${character + 1})`, `${message}`);
  } else {
    LOGE("Error",message);
  }

}

export function createDiagnosticOnFirstToken(file:ts.SourceFile, node: ts.Node ,message: ts.DiagnosticMessage,...args:(string | number | undefined)[]) {
   let span = jshelpers.getSpanOfTokenAtPosition(file, node.pos);
   let diagnostic = jshelpers.createFileDiagnostic(file,span.start,span.length,message,...args);
   return diagnostic;
}

export function createFileDiagnostic(node: ts.Node, message: ts.DiagnosticMessage, ...args: (string | number | undefined)[]) {
    let diagnostic;
    let soureceFile: ts.SourceFile = jshelpers.getSourceFileOfNode(node);
    let span = jshelpers.getErrorSpanForNode(soureceFile, node);
    switch (node.kind) {
        case ts.SyntaxKind.Identifier:
            diagnostic = jshelpers.createFileDiagnostic(soureceFile, span.start, span.length, message, ts.idText(<ts.Identifier>node));
            break;
        case ts.SyntaxKind.PrivateIdentifier:
            diagnostic = jshelpers.createFileDiagnostic(soureceFile, span.start, span.length, message, ts.idText(<ts.PrivateIdentifier>node));
            break;
        case ts.SyntaxKind.ReturnStatement:
            diagnostic = createDiagnosticOnFirstToken(soureceFile, node, message, ...args);
            break;
        default:
            diagnostic = jshelpers.createDiagnosticForNode(node, message, ...args);
            break;
    }

    return diagnostic;
}

export function createDiagnostic(file:ts.SourceFile | undefined, location: ts.Node | undefined, message: ts.DiagnosticMessage,...args:(string | number | undefined)[]) {
  var diagnostic;

  if (!location) {
    return jshelpers.createCompilerDiagnostic(message, ...args);
   }

  if (file) {
    diagnostic = createFileDiagnostic(location, message, ...args);
  } else {
    diagnostic = jshelpers.createDiagnosticForNode(location, message, ...args)
  }

  return diagnostic
}

// @ts-ignore
function diag(code:number, category:ts.DiagnosticCategory, key:string, message:string, reportsUnnecessary?:{},elidedInCompatabilityPyramid?:{}):ts.DiagnosticMessage {
   return { code: code, category: category, key: key, message: message, reportsUnnecessary: reportsUnnecessary };
}


export enum DiagnosticCode {
   Identifier_expected = 1003,
   A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma = 1013,
   A_rest_parameter_must_be_last_in_a_parameter_list = 1014,
   Parameter_cannot_have_question_mark_and_initializer = 1015,
   A_required_parameter_cannot_follow_an_optional_parameter = 1016,
   The_readonly_modifier_can_only_appear_on_a_property_declaration_or_index_signature = 1024,
   Accessibility_modifier_already_seen = 1028,
   _0_modifier_must_precede_1_modifier = 1029,
   _0_modifier_already_seen = 1030,
   _0_modifier_cannot_appear_on_class_elements_of_this_kind = 1031,
   A_declare_modifier_cannot_be_used_in_an_already_ambient_context = 1038,
   _0_modifier_cannot_be_used_in_an_ambient_context = 1040,
   _0_modifier_cannot_be_used_here = 1042,
   _0_modifier_cannot_appear_on_a_module_or_namespace_element = 1044,
   A_rest_parameter_cannot_be_optional = 1047,
   A_rest_parameter_cannot_have_an_initializer = 1048,
   _0_modifier_cannot_appear_on_a_type_member = 1070,
   _0_modifier_cannot_appear_on_an_index_signature = 1071,
   A_0_modifier_cannot_be_used_with_an_import_declaration = 1079,
   _0_modifier_cannot_appear_on_a_constructor_declaration = 1089,
   _0_modifier_cannot_appear_on_a_parameter = 1090,
   Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement = 1091,
   Invalid_use_of_0_in_strict_mode = 1100,
   A_with_statements_are_not_allowed_in_strict_mode = 1101,
   A_delete_cannot_be_called_on_an_identifier_in_strict_mode = 1102,
   A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement = 1104,
   A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement = 1105,
   Jump_target_cannot_cross_function_boundary = 1107,
   A_return_statement_can_only_be_used_within_a_function_body = 1108,
   A_default_clause_cannot_appear_more_than_once_in_a_switch_statement = 1113,
   Duplicate_label_0 = 1114,
   A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement = 1115,
   A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement = 1116,
   An_object_literal_cannot_have_multiple_properties_with_the_same_name_in_strict_mode = 1117,
   An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name = 1118,
   An_object_literal_cannot_have_property_and_accessor_with_the_same_name = 1119,
   An_export_assignment_cannot_have_modifiers = 1120,
   Octal_literals_are_not_allowed_in_strict_mode = 1121,
   Octal_escape_sequences_are_not_allowed_in_strict_mode = 1122,
   Variable_declaration_list_cannot_be_empty = 1123,
   Line_break_not_permitted_here = 1142,
   Cannot_use_imports_exports_or_module_augmentations_when_module_is_none = 1148,
   The_const_declarations_can_only_be_declared_inside_a_block = 1156,
   The_const_declarations_must_be_initialized = 1155,
   The_let_declarations_can_only_be_declared_inside_a_block = 1157,
   Unterminated_regular_expression_literal = 1161,
   An_object_member_cannot_be_declared_optional = 1162,
   A_yield_expression_is_only_allowed_in_a_generator_body = 1163,
   A_comma_expression_is_not_allowed_in_a_computed_property_name = 1171,
   The_extends_clause_already_seen = 1172,
   Classes_can_only_extend_a_single_class = 1174,
   The_implements_clause_already_seen = 1175,
   Property_destructuring_pattern_expected = 1180,
   A_destructuring_declaration_must_have_an_initializer = 1182,
   A_rest_element_cannot_have_an_initializer = 1186,
   A_parameter_property_may_not_be_declared_using_a_binding_pattern = 1187,
   Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement = 1188,
   The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer = 1189,
   The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer = 1190,
   An_import_declaration_cannot_have_modifiers = 1191,
   An_export_declaration_cannot_have_modifiers = 1193,
   Line_terminator_not_permitted_before_arrow = 1200,
   Decorators_are_not_valid_here = 1206,
   Decorators_cannot_be_applied_to_multiple_get_Slashset_accessors_of_the_same_name = 1207,
   Invalid_use_of_0_Class_definitions_are_automatically_in_strict_mode = 1210,
   A_class_or_function_declaration_without_the_default_modifier_must_have_a_name = 1211,
   Identifier_expected_0_is_a_reserved_word_in_strict_mode = 1212,
   Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_strict_mode = 1213,
   Identifier_expected_0_is_a_reserved_word_in_strict_mode_Modules_are_automatically_in_strict_mode = 1214,
   An_export_assignment_must_be_at_the_top_level_of_a_file_or_module_declaration = 1231,
   An_import_declaration_can_only_be_used_in_a_namespace_or_module = 1232,
   An_export_declaration_can_only_be_used_in_a_module = 1233,
   The_abstract_modifier_can_only_appear_on_a_class_method_or_property_declaration = 1242,
   _0_modifier_cannot_be_used_with_1_modifier = 1243,
   Abstract_methods_can_only_appear_within_an_abstract_class = 1244,
   A_class_member_cannot_have_the_0_keyword = 1248,
   A_decorator_can_only_decorate_a_method_implementation_not_an_overload = 1249,
   Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5 = 1250,
   Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Class_definitions_are_automatically_in_strict_mode = 1251,
   Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Modules_are_automatically_in_strict_mode = 1252,
   A_definite_assignment_assertion_is_not_permitted_in_this_context = 1255,
   Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module = 1262,
   Declarations_with_initializers_cannot_also_have_definite_assignment_assertions = 1263,
   Declarations_with_definite_assignment_assertions_must_also_have_type_annotations = 1264,
   await_expressions_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules = 1308,
   Did_you_mean_to_use_a_Colon_An_can_only_follow_a_property_name_when_the_containing_object_literal_is_part_of_a_destructuring_pattern = 1312,
   A_parameter_property_cannot_be_declared_using_a_rest_parameter = 1317,
   A_default_export_can_only_be_used_in_an_ECMAScript_style_module = 1319,
   Argument_of_dynamic_import_cannot_be_spread_element = 1325,
   use_strict_directive_cannot_be_used_with_non_simple_parameter_list = 1347,
   Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here = 1359,
   Dynamic_imports_can_only_accept_a_module_specifier_optional_assertion_is_not_supported_yet = 1450,
   Duplicate_identifier_0 = 2300,
   Module_0_has_no_exported_member_1 = 2305,
   Module_0_has_already_exported_a_member_named_1 = 2308,
   An_export_assignment_cannot_be_used_in_a_module_with_other_exported_elements = 2309,
   The_super_can_only_be_referenced_in_a_derived_class = 2335,
   The_super_cannot_be_referenced_in_constructor_arguments = 2336,
   Super_calls_are_not_permitted_outside_constructors_or_in_nested_functions_inside_constructors = 2337,
   The_super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_derived_class = 2338,
   The_left_hand_side_of_an_instanceof_expression_must_be_of_type_any_an_object_type_or_a_type_parameter = 2358,
   The_right_hand_side_of_an_instanceof_expression_must_be_of_type_any_or_of_a_type_assignable_to_the_Function_interface_type = 2359,
   The_left_hand_side_of_an_in_expression_must_be_of_type_any_string_number_or_symbol = 2360,
   The_right_hand_side_of_an_in_expression_must_be_of_type_any_an_object_type_or_a_type_parameter = 2361,
   The_left_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type = 2362,
   The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type = 2363,
   The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access = 2364,
   Multiple_constructor_implementations_are_not_allowed = 2392,
   Declaration_name_conflicts_with_built_in_global_identifier_0 = 2397,
   The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation = 2404,
   Import_declaration_conflicts_with_local_declaration_of_0 = 2440,
   The_super_cannot_be_referenced_in_a_computed_property_name = 2466,
   A_rest_element_must_be_last_in_a_destructuring_pattern = 2462,
   The_let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations = 2480,
   The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation = 2483,
   The_left_hand_side_of_a_for_of_statement_must_be_a_variable_or_a_property_access = 2487,
   The_left_hand_side_of_a_for_in_statement_cannot_be_a_destructuring_pattern = 2491,
   A_rest_element_cannot_contain_a_binding_pattern = 2501,
   A_module_cannot_have_multiple_default_exports = 2528,
   The_super_can_only_be_referenced_in_members_of_derived_classes_or_object_literal_expressions = 2660,
   Cannot_export_0_Only_local_declarations_can_be_exported_from_a_module = 2661,
   Left_side_of_comma_operator_is_unused_and_has_no_side_effects = 2695,
   The_target_of_an_object_rest_assignment_must_be_a_variable_or_a_property_access = 2701,
   The_target_of_an_object_rest_assignment_may_not_be_an_optional_property_access = 2778,
   The_left_hand_side_of_an_assignment_expression_may_not_be_an_optional_property_access = 2779,
   The_left_hand_side_of_a_for_of_statement_may_not_be_an_optional_property_access = 2781,
   _0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2 = 17012,
   Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constructor = 17013,
   An_accessibility_modifier_cannot_be_used_with_a_private_identifier = 18010,
   Private_identifiers_are_not_allowed_outside_class_bodies = 18016,
   _0_modifier_cannot_be_used_with_a_private_identifier = 18019,
   In_strict_mode_code_functions_can_only_be_declared_at_top_level_or_inside_a_block = 19000,
   Class_Declaration_can_only_be_declared_at_top_level_or_inside_a_block = 19001,
   Incorrect_regular_expression = 19002,
   Invalid_regular_expression_Colon_0_Colon_Invalid_escape = 19003,
   _8_and_9_are_not_allowed_in_strict_mode = 19004,
   const_and_let_declarations_not_allowed_in_statement_positions = 19005,
   Getter_must_not_have_any_formal_parameters = 19006,
   Class_declaration_not_allowed_in_statement_position = 19007,
   Lexical_declaration_let_not_allowed_in_statement_position = 19008,
   Lexical_declaration_const_not_allowed_in_statement_position = 19009,
   Invalid_regular_expression_flag_0 = 19010,
   Unexpected_eval_or_arguments_in_strict_mode = 20000,
};

export function getDiagnostic(code:DiagnosticCode): ts.DiagnosticMessage|undefined {
   switch (code) {
   case 1003 :
      return diag(1003, ts.DiagnosticCategory.Error, "Identifier_expected_1003", "Identifier expected.");
   case 1013 :
      return diag(1013, ts.DiagnosticCategory.Error, "A_rest_parameter_or_binding_pattern_may_not_have_a_trailing_comma_1013", "A rest parameter or binding pattern may not have a trailing comma.");
   case 1014 :
      return diag(1014, ts.DiagnosticCategory.Error, "A_rest_parameter_must_be_last_in_a_parameter_list_1014", "A rest parameter must be last in a parameter list.");
   case 1015 :
      return diag(1015, ts.DiagnosticCategory.Error, "Parameter_cannot_have_question_mark_and_initializer_1015", "Parameter cannot have question mark and initializer.");
   case 1016 :
      return diag(1016, ts.DiagnosticCategory.Error, "A_required_parameter_cannot_follow_an_optional_parameter_1016", "A required parameter cannot follow an optional parameter.");
   case 1024 :
      return diag(1024, ts.DiagnosticCategory.Error, "The_readonly_modifier_can_only_appear_on_a_property_declaration_or_index_signature_1024", "The 'readonly' modifier can only appear on a property declaration or index signature.");
   case 1028 :
      return diag(1028, ts.DiagnosticCategory.Error, "Accessibility_modifier_already_seen_1028", "Accessibility modifier already seen.");
   case 1029 :
      return diag(1029, ts.DiagnosticCategory.Error, "_0_modifier_must_precede_1_modifier_1029", "'{0}' modifier must precede '{1}' modifier.");
   case 1030 :
      return diag(1030, ts.DiagnosticCategory.Error, "_0_modifier_already_seen_1030", "'{0}' modifier already seen.");
   case 1031 :
      return diag(1031, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_class_elements_of_this_kind_1031", "'{0}' modifier cannot appear on class elements of this kind.");
   case 1038 :
      return diag(1038, ts.DiagnosticCategory.Error, "A_declare_modifier_cannot_be_used_in_an_already_ambient_context_1038", "A 'declare' modifier cannot be used in an already ambient context.");
   case 1040 :
      return diag(1040, ts.DiagnosticCategory.Error, "_0_modifier_cannot_be_used_in_an_ambient_context_1040", "'{0}' modifier cannot be used in an ambient context.");
   case 1042 :
      return diag(1042, ts.DiagnosticCategory.Error, "_0_modifier_cannot_be_used_here_1042", "'{0}' modifier cannot be used here.");
   case 1044 :
      return diag(1044, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_a_module_or_namespace_element_1044", "'{0}' modifier cannot appear on a module or namespace element.");
   case 1047 :
      return diag(1047, ts.DiagnosticCategory.Error, "A_rest_parameter_cannot_be_optional_1047", "A rest parameter cannot be optional.");
   case 1048 :
      return diag(1048, ts.DiagnosticCategory.Error, "A_rest_parameter_cannot_have_an_initializer_1048", "A rest parameter cannot have an initializer.");
   case 1070 :
      return diag(1070, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_a_type_member_1070", "'{0}' modifier cannot appear on a type member.");
   case 1071 :
      return diag(1071, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_an_index_signature_1071", "'{0}' modifier cannot appear on an index signature.");
   case 1079 :
      return diag(1079, ts.DiagnosticCategory.Error, "A_0_modifier_cannot_be_used_with_an_import_declaration_1079", "A '{0}' modifier cannot be used with an import declaration.");
   case 1089 :
      return diag(1089, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_a_constructor_declaration_1089", "'{0}' modifier cannot appear on a constructor declaration.");
   case 1090 :
      return diag(1090, ts.DiagnosticCategory.Error, "_0_modifier_cannot_appear_on_a_parameter_1090", "'{0}' modifier cannot appear on a parameter.");
   case 1091 :
      return diag(1091, ts.DiagnosticCategory.Error, "Only_a_single_variable_declaration_is_allowed_in_a_for_in_statement_1091", "Only a single variable declaration is allowed in a 'for...in' statement.");
   case 1100 :
      return diag(1100, ts.DiagnosticCategory.Error, "Invalid_use_of_0_in_strict_mode_1100", "Invalid use of '{0}' in strict mode.");
   case 1101 :
      return diag(1101, ts.DiagnosticCategory.Error, "A_with_statements_are_not_allowed_in_strict_mode_1101", "A 'with' statements are not allowed in strict mode.");
   case 1102 :
      return diag(1102, ts.DiagnosticCategory.Error, "A_delete_cannot_be_called_on_an_identifier_in_strict_mode_1102", "A 'delete' cannot be called on an identifier in strict mode.");
   case 1104 :
      return diag(1104, ts.DiagnosticCategory.Error, "A_continue_statement_can_only_be_used_within_an_enclosing_iteration_statement_1104", "A 'continue' statement can only be used within an enclosing iteration statement.");
   case 1105 :
      return diag(1105, ts.DiagnosticCategory.Error, "A_break_statement_can_only_be_used_within_an_enclosing_iteration_or_switch_statement_1105", "A 'break' statement can only be used within an enclosing iteration or switch statement.");
   case 1107 :
      return diag(1107, ts.DiagnosticCategory.Error, "Jump_target_cannot_cross_function_boundary_1107", "Jump target cannot cross function boundary.");
   case 1108 :
      return diag(1108, ts.DiagnosticCategory.Error, "A_return_statement_can_only_be_used_within_a_function_body_1108", "A 'return' statement can only be used within a function body.");
   case 1113 :
      return diag(1113, ts.DiagnosticCategory.Error, "A_default_clause_cannot_appear_more_than_once_in_a_switch_statement_1113", "A 'default' clause cannot appear more than once in a 'switch' statement.");
   case 1114 :
      return diag(1114, ts.DiagnosticCategory.Error, "Duplicate_label_0_1114", "Duplicate label '{0}'.");
   case 1115 :
      return diag(1115, ts.DiagnosticCategory.Error, "A_continue_statement_can_only_jump_to_a_label_of_an_enclosing_iteration_statement_1115", "A 'continue' statement can only jump to a label of an enclosing iteration statement.");
   case 1116 :
      return diag(1116, ts.DiagnosticCategory.Error, "A_break_statement_can_only_jump_to_a_label_of_an_enclosing_statement_1116", "A 'break' statement can only jump to a label of an enclosing statement.");
   case 1117 :
      return diag(1117, ts.DiagnosticCategory.Error, "An_object_literal_cannot_have_multiple_properties_with_the_same_name_in_strict_mode_1117", "An object literal cannot have multiple properties with the same name in strict mode.");
   case 1118 :
      return diag(1118, ts.DiagnosticCategory.Error, "An_object_literal_cannot_have_multiple_get_Slashset_accessors_with_the_same_name_1118", "An object literal cannot have multiple get/set accessors with the same name.");
   case 1119 :
      return diag(1119, ts.DiagnosticCategory.Error, "An_object_literal_cannot_have_property_and_accessor_with_the_same_name_1119", "An object literal cannot have property and accessor with the same name.");
   case 1120 :
      return diag(1120, ts.DiagnosticCategory.Error, "An_export_assignment_cannot_have_modifiers_1120", "An export assignment cannot have modifiers.");
   case 1121 :
      return diag(1121, ts.DiagnosticCategory.Error, "Octal_literals_are_not_allowed_in_strict_mode_1121", "Octal literals are not allowed in strict mode.");
   case 1122 :
      return diag(1122, ts.DiagnosticCategory.Error, "Octal_escape_sequences_are_not_allowed_in_strict_mode_1122", "Octal escape sequences are not allowed in strict mode.");
   case 1123 :
      return diag(1123, ts.DiagnosticCategory.Error, "Variable_declaration_list_cannot_be_empty_1123", "Variable declaration list cannot be empty.");
   case 1142 :
      return diag(1142, ts.DiagnosticCategory.Error, "Line_break_not_permitted_here_1142", "Line break not permitted here.");
   case 1148 :
      return diag(1148, ts.DiagnosticCategory.Error, "Cannot_use_imports_exports_or_module_augmentations_when_module_is_none_1148", "Cannot use imports, exports, or module augmentations when '--module' is 'none'.");
   case 1156 :
      return diag(1156, ts.DiagnosticCategory.Error, "The_const_declarations_can_only_be_declared_inside_a_block_1156", "The 'const' declarations can only be declared inside a block.");
   case 1155 :
      return diag(1155, ts.DiagnosticCategory.Error, "The_const_declarations_must_be_initialized_1155", "The 'const' declarations must be initialized.");
   case 1157 :
      return diag(1157, ts.DiagnosticCategory.Error, "The_let_declarations_can_only_be_declared_inside_a_block_1157", "The 'let' declarations can only be declared inside a block.");
   case 1161 :
      return diag(1161, ts.DiagnosticCategory.Error, "Unterminated_regular_expression_literal_1161", "Unterminated regular expression literal.");
   case 1162 :
      return diag(1162, ts.DiagnosticCategory.Error, "An_object_member_cannot_be_declared_optional_1162", "An object member cannot be declared optional.");
   case 1163 :
      return diag(1163, ts.DiagnosticCategory.Error, "A_yield_expression_is_only_allowed_in_a_generator_body_1163", "A 'yield' expression is only allowed in a generator body.");
   case 1171 :
      return diag(1171, ts.DiagnosticCategory.Error, "A_comma_expression_is_not_allowed_in_a_computed_property_name_1171", "A comma expression is not allowed in a computed property name.");
   case 1172 :
      return diag(1172, ts.DiagnosticCategory.Error, "The_extends_clause_already_seen_1172", "The 'extends' clause already seen.");
   case 1174 :
      return diag(1174, ts.DiagnosticCategory.Error, "Classes_can_only_extend_a_single_class_1174", "Classes can only extend a single class.");
   case 1175 :
      return diag(1175, ts.DiagnosticCategory.Error, "The_implements_clause_already_seen_1175", "The 'implements' clause already seen.");
   case 1180 :
      return diag(1180, ts.DiagnosticCategory.Error, "Property_destructuring_pattern_expected_1180", "Property destructuring pattern expected.");
   case 1182 :
      return diag(1182, ts.DiagnosticCategory.Error, "A_destructuring_declaration_must_have_an_initializer_1182", "A destructuring declaration must have an initializer.");
   case 1186 :
      return diag(1186, ts.DiagnosticCategory.Error, "A_rest_element_cannot_have_an_initializer_1186", "A_rest_element_cannot_have_an_initializer.");
   case 1187 :
      return diag(1187, ts.DiagnosticCategory.Error, "A_parameter_property_may_not_be_declared_using_a_binding_pattern_1187", "A parameter property may not be declared using a binding pattern.");
   case 1188 :
      return diag(1188, ts.DiagnosticCategory.Error, "Only_a_single_variable_declaration_is_allowed_in_a_for_of_statement_1188", "Only a single variable declaration is allowed in a 'for...of' statement.");
   case 1189 :
      return diag(1189, ts.DiagnosticCategory.Error, "The_variable_declaration_of_a_for_in_statement_cannot_have_an_initializer_1189", "The variable declaration of a 'for...in' statement cannot have an initializer.");
   case 1190 :
      return diag(1190, ts.DiagnosticCategory.Error, "The_variable_declaration_of_a_for_of_statement_cannot_have_an_initializer_1190", "The variable declaration of a 'for...of' statement cannot have an initializer.");
   case 1191 :
      return diag(1191, ts.DiagnosticCategory.Error, "An_import_declaration_cannot_have_modifiers_1191", "An import declaration cannot have modifiers.");
   case 1193 :
      return diag(1193, ts.DiagnosticCategory.Error, "An_export_declaration_cannot_have_modifiers_1193", "An export declaration cannot have modifiers.");
   case 1200 :
      return diag(1200, ts.DiagnosticCategory.Error, "Line_terminator_not_permitted_before_arrow_1200", "Line terminator not permitted before arrow.");
   case 1206 :
      return diag(1206, ts.DiagnosticCategory.Error, "Decorators_are_not_valid_here_1206", "Decorators are not valid here.");
   case 1207 :
      return diag(1207, ts.DiagnosticCategory.Error, "Decorators_cannot_be_applied_to_multiple_get_Slashset_accessors_of_the_same_name_1207", "Decorators cannot be applied to multiple get/set accessors of the same name.");
   case 1210 :
      return diag(1210, ts.DiagnosticCategory.Error, "Invalid_use_of_0_Class_definitions_are_automatically_in_strict_mode_1210", "Invalid use of '{0}'. Class definitions are automatically in strict mode.");
   case 1211 :
      return diag(1211, ts.DiagnosticCategory.Error, "A_class_or_function_declaration_without_the_default_modifier_must_have_a_name_1211", "A class or function declaration without the 'default' modifier must have a name.");
   case 1212 :
      return diag(1212, ts.DiagnosticCategory.Error, "Identifier_expected_0_is_a_reserved_word_in_strict_mode_1212", "Identifier expected. '{0}' is a reserved word in strict mode.");
   case 1213 :
      return diag(1213, ts.DiagnosticCategory.Error, "Identifier_expected_0_is_a_reserved_word_in_strict_mode_Class_definitions_are_automatically_in_stric_1213", "Identifier expected. '{0}' is a reserved word in strict mode. Class definitions are automatically in strict mode.");
   case 1214 :
      return diag(1214, ts.DiagnosticCategory.Error, "Identifier_expected_0_is_a_reserved_word_in_strict_mode_Modules_are_automatically_in_strict_mode_1214", "Identifier expected. '{0}' is a reserved word in strict mode. Modules are automatically in strict mode.");
   case 1231 :
      return diag(1231, ts.DiagnosticCategory.Error, "An_export_assignment_must_be_at_the_top_level_of_a_file_or_module_declaration_1231", "An export assignment must be at the top level of a file or module declaration.");
   case 1232 :
      return diag(1232, ts.DiagnosticCategory.Error, "An_import_declaration_can_only_be_used_in_a_namespace_or_module_1232", "An import declaration can only be used in a namespace or module.");
   case 1233 :
      return diag(1233, ts.DiagnosticCategory.Error, "An_export_declaration_can_only_be_used_in_a_module_1233", "An export declaration can only be used in a module.");
   case 1242 :
      return diag(1242, ts.DiagnosticCategory.Error, "The_abstract_modifier_can_only_appear_on_a_class_method_or_property_declaration_1242", "The 'abstract' modifier can only appear on a class, method, or property declaration.");
   case 1243 :
      return diag(1243, ts.DiagnosticCategory.Error, "_0_modifier_cannot_be_used_with_1_modifier_1243", "'{0}' modifier cannot be used with '{1}' modifier.");
   case 1244 :
      return diag(1244, ts.DiagnosticCategory.Error, "Abstract_methods_can_only_appear_within_an_abstract_class_1244", "Abstract methods can only appear within an abstract class.");
   case 1248 :
      return diag(1248, ts.DiagnosticCategory.Error, "A_class_member_cannot_have_the_0_keyword_1248", "A class member cannot have the '{0}' keyword.");
   case 1249 :
      return diag(1249, ts.DiagnosticCategory.Error, "A_decorator_can_only_decorate_a_method_implementation_not_an_overload_1249", "A decorator can only decorate a method implementation, not an overload.");
   case 1250 :
      return diag(1250, ts.DiagnosticCategory.Error, "Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_1250", "Function declarations are not allowed inside blocks in strict mode when targeting 'ES3' or 'ES5'.");
   case 1251 :
      return diag(1251, ts.DiagnosticCategory.Error, "Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Class_d_1251", "Function declarations are not allowed inside blocks in strict mode when targeting 'ES3' or 'ES5'. Class definitions are automatically in strict mode.");
   case 1252 :
      return diag(1252, ts.DiagnosticCategory.Error, "Function_declarations_are_not_allowed_inside_blocks_in_strict_mode_when_targeting_ES3_or_ES5_Modules_1252", "Function declarations are not allowed inside blocks in strict mode when targeting 'ES3' or 'ES5'. Modules are automatically in strict mode.");
   case 1255 :
      return diag(1255, ts.DiagnosticCategory.Error, "A_definite_assignment_assertion_is_not_permitted_in_this_context_1255", "A definite assignment assertion '!' is not permitted in this context.");
   case 1262 :
      return diag(1262, ts.DiagnosticCategory.Error, "Identifier_expected_0_is_a_reserved_word_at_the_top_level_of_a_module_1262", "Identifier expected. '{0}' is a reserved word at the top-level of a module.");
   case 1263 :
      return diag(1263, ts.DiagnosticCategory.Error, "Declarations_with_initializers_cannot_also_have_definite_assignment_assertions_1263", "Declarations with initializers cannot also have definite assignment assertions.");
   case 1264 :
      return diag(1264, ts.DiagnosticCategory.Error, "Declarations_with_definite_assignment_assertions_must_also_have_type_annotations_1264", "Declarations with definite assignment assertions must also have type annotations.");
   case 1308 :
      return diag(1308, ts.DiagnosticCategory.Error, "await_expressions_are_only_allowed_within_async_functions_and_at_the_top_levels_of_modules_1308", "await expressions are only allowed within async functions and at the top levels of modules.");
   case 1312 :
      return diag(1312, ts.DiagnosticCategory.Error, "Did_you_mean_to_use_a_Colon_An_can_only_follow_a_property_name_when_the_containing_object_literal_is_1312", "Did you mean to use a ':'? An '=' can only follow a property name when the containing object literal is part of a destructuring pattern.");
   case 1317 :
      return diag(1317, ts.DiagnosticCategory.Error, "A_parameter_property_cannot_be_declared_using_a_rest_parameter_1317", "A parameter property cannot be declared using a rest parameter.");
   case 1319 :
      return diag(1319, ts.DiagnosticCategory.Error, "A_default_export_can_only_be_used_in_an_ECMAScript_style_module_1319", "A default export can only be used in an ECMAScript-style module.");
   case 1325 :
      return diag(1325, ts.DiagnosticCategory.Error, "Argument_of_dynamic_import_cannot_be_spread_element_1325", "Argument of dynamic import cannot be spread element.");
   case 1347 :
      return diag(1347, ts.DiagnosticCategory.Error, "use_strict_directive_cannot_be_used_with_non_simple_parameter_list_1347", "use strict directive cannot be used with non-simple parameter list.");
   case 1359 :
      return diag(1359, ts.DiagnosticCategory.Error, "Identifier_expected_0_is_a_reserved_word_that_cannot_be_used_here_1359", "Identifier expected. '{0}' is a reserved word that cannot be used here.");
   case 1450 :
      return diag(1450, ts.DiagnosticCategory.Error, "Dynamic_imports_can_only_accept_a_module_specifier_optional_assertion_is_not_supported_yet_1450", "Dynamic imports can only accept a module specifier, optional assertion is not supported yet.");
   case 2300 :
      return diag(2300, ts.DiagnosticCategory.Error, "Duplicate_identifier_0_2300", "Duplicate identifier '{0}'.");
   case 2305 :
      return diag(2305, ts.DiagnosticCategory.Error, "Module_0_has_no_exported_member_1_2305", "Module '{0}' has no exported member '{1}'.");
   case 2308 :
      return diag(2308, ts.DiagnosticCategory.Error, "Module_0_has_already_exported_a_member_named_1_2308", "Module '{0}' has already exported a member named '{1}'.");
   case 2309 :
      return diag(2309, ts.DiagnosticCategory.Error, "An_export_assignment_cannot_be_used_in_a_module_with_other_exported_elements_2309", "An export assignment cannot be used in a module with other exported elements.");
   case 2335 :
      return diag(2335, ts.DiagnosticCategory.Error, "The_super_can_only_be_referenced_in_a_derived_class_2335", "The 'super' can only be referenced in a derived class.");
   case 2336 :
      return diag(2336, ts.DiagnosticCategory.Error, "The_super_cannot_be_referenced_in_constructor_arguments_2336", "The 'super' cannot be referenced in constructor arguments.");
   case 2337 :
      return diag(2337, ts.DiagnosticCategory.Error, "Super_calls_are_not_permitted_outside_constructors_or_in_nested_functions_inside_constructors_2337", "Super calls are not permitted outside constructors or in nested functions inside constructors.");
   case 2338 :
      return diag(2338, ts.DiagnosticCategory.Error, "The_super_property_access_is_permitted_only_in_a_constructor_member_function_or_member_accessor_of_a_2338", "The 'super' property access is permitted only in a constructor, member function, or member accessor of a derived class.");
   case 2358 :
      return diag(2358, ts.DiagnosticCategory.Error, "The_left_hand_side_of_an_instanceof_expression_must_be_of_type_any_an_object_type_or_a_type_paramete_2358", "The left-hand side of an 'instanceof' expression must be of type 'any', an object type or a type parameter.");
   case 2359 :
      return diag(2359, ts.DiagnosticCategory.Error, "The_right_hand_side_of_an_instanceof_expression_must_be_of_type_any_or_of_a_type_assignable_to_the_F_2359", "The right-hand side of an 'instanceof' expression must be of type 'any' or of a type assignable to the 'Function' interface type.");
   case 2360 :
      return diag(2360, ts.DiagnosticCategory.Error, "The_left_hand_side_of_an_in_expression_must_be_of_type_any_string_number_or_symbol_2360", "The left-hand side of an 'in' expression must be of type 'any', 'string', 'number', or 'symbol'.");
   case 2361 :
      return diag(2361, ts.DiagnosticCategory.Error, "The_right_hand_side_of_an_in_expression_must_be_of_type_any_an_object_type_or_a_type_parameter_2361", "The right-hand side of an 'in' expression must be of type 'any', an object type or a type parameter.");
   case 2362 :
      return diag(2362, ts.DiagnosticCategory.Error, "The_left_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type_2362", "The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.");
   case 2363 :
      return diag(2363, ts.DiagnosticCategory.Error, "The_right_hand_side_of_an_arithmetic_operation_must_be_of_type_any_number_bigint_or_an_enum_type_2363", "The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.");
   case 2364 :
      return diag(2364, ts.DiagnosticCategory.Error, "The_left_hand_side_of_an_assignment_expression_must_be_a_variable_or_a_property_access_2364", "The left-hand side of an assignment expression must be a variable or a property access.");
   case 2392 :
      return diag(2392, ts.DiagnosticCategory.Error, "Multiple_constructor_implementations_are_not_allowed_2392", "Multiple constructor implementations are not allowed.");
   case 2397 :
      return diag(2397, ts.DiagnosticCategory.Error, "Declaration_name_conflicts_with_built_in_global_identifier_0_2397", "Declaration name conflicts with built-in global identifier '{0}'.");
   case 2404 :
      return diag(2404, ts.DiagnosticCategory.Error, "The_left_hand_side_of_a_for_in_statement_cannot_use_a_type_annotation_2404", "The left-hand side of a 'for...in' statement cannot use a type annotation.");
   case 2440 :
      return diag(2440, ts.DiagnosticCategory.Error, "Import_declaration_conflicts_with_local_declaration_of_0_2440", "Import declaration conflicts with local declaration of '{0}'.");
   case 2466 :
      return diag(2466, ts.DiagnosticCategory.Error, "The_super_cannot_be_referenced_in_a_computed_property_name_2466", "The 'super' cannot be referenced in a computed property name.");
   case 2462 :
      return diag(2462, ts.DiagnosticCategory.Error, "A_rest_element_must_be_last_in_a_destructuring_pattern_2462", "A rest element must be last in a destructuring pattern.");
   case 2480 :
      return diag(2480, ts.DiagnosticCategory.Error, "The_let_is_not_allowed_to_be_used_as_a_name_in_let_or_const_declarations_2480", "The 'let' is not allowed to be used as a name in 'let' or 'const' declarations.");
   case 2483 :
      return diag(2483, ts.DiagnosticCategory.Error, "The_left_hand_side_of_a_for_of_statement_cannot_use_a_type_annotation_2483", "The left-hand side of a 'for...of' statement cannot use a type annotation.");
   case 2487 :
      return diag(2487, ts.DiagnosticCategory.Error, "The_left_hand_side_of_a_for_of_statement_must_be_a_variable_or_a_property_access_2487", "The left-hand side of a 'for...of' statement must be a variable or a property access.");
   case 2491 :
      return diag(2491, ts.DiagnosticCategory.Error, "The_left_hand_side_of_a_for_in_statement_cannot_be_a_destructuring_pattern_2491", "The left-hand side of a 'for...in' statement cannot be a destructuring pattern.");
   case 2501 :
      return diag(2501, ts.DiagnosticCategory.Error, "A_rest_element_cannot_contain_a_binding_pattern_2501", "A rest element cannot contain a binding pattern.");
   case 2528 :
      return diag(2528, ts.DiagnosticCategory.Error, "A_module_cannot_have_multiple_default_exports_2528", "A module cannot have multiple default exports.");
   case 2660 :
      return diag(2660, ts.DiagnosticCategory.Error, "The_super_can_only_be_referenced_in_members_of_derived_classes_or_object_literal_expressions_2660", "The 'super' can only be referenced in members of derived classes or object literal expressions.");
   case 2661 :
      return diag(2661, ts.DiagnosticCategory.Error, "Cannot_export_0_Only_local_declarations_can_be_exported_from_a_module_2661", "Cannot export '{0}'. Only local declarations can be exported from a module.");
   case 2695 :
      return diag(2695, ts.DiagnosticCategory.Error, "Left_side_of_comma_operator_is_unused_and_has_no_side_effects_2695", "Left side of comma operator is unused and has no side effects.", /*reportsUnnecessary*/ true);
   case 2701 :
      return diag(2701, ts.DiagnosticCategory.Error, "The_target_of_an_object_rest_assignment_must_be_a_variable_or_a_property_access_2701", "The target of an object rest assignment must be a variable or a property access.");
   case 2778 :
      return diag(2778, ts.DiagnosticCategory.Error, "The_target_of_an_object_rest_assignment_may_not_be_an_optional_property_access_2778", "The target of an object rest assignment may not be an optional property access.");
   case 2779 :
      return diag(2779, ts.DiagnosticCategory.Error, "The_left_hand_side_of_an_assignment_expression_may_not_be_an_optional_property_access_2779", "The left-hand side of an assignment expression may not be an optional property access.");
   case 2781 :
      return diag(2781, ts.DiagnosticCategory.Error, "The_left_hand_side_of_a_for_of_statement_may_not_be_an_optional_property_access_2781", "The left-hand side of a 'for...of' statement may not be an optional property access.");
   case 17012 :
      return diag(17012, ts.DiagnosticCategory.Error, "_0_is_not_a_valid_meta_property_for_keyword_1_Did_you_mean_2_17012", "'{0}' is not a valid meta-property for keyword '{1}'. Did you mean '{2}'?");
   case 17013 :
      return diag(17013, ts.DiagnosticCategory.Error, "Meta_property_0_is_only_allowed_in_the_body_of_a_function_declaration_function_expression_or_constru_17013", "Meta-property '{0}' is only allowed in the body of a function declaration, function expression, or constructor.");
   case 18010 :
      return diag(18010, ts.DiagnosticCategory.Error, "An_accessibility_modifier_cannot_be_used_with_a_private_identifier_18010", "An accessibility modifier cannot be used with a private identifier.");
   case 18016 :
      return diag(18016, ts.DiagnosticCategory.Error, "Private_identifiers_are_not_allowed_outside_class_bodies_18016", "Private identifiers are not allowed outside class bodies.");
   case 18019 :
      return diag(18019, ts.DiagnosticCategory.Error, "_0_modifier_cannot_be_used_with_a_private_identifier_18019", "'{0}' modifier cannot be used with a private identifier.");
   case 19000 :
      return diag(19000, ts.DiagnosticCategory.Error, "In_strict_mode_code_functions_can_only_be_declared_at_top_level_or_inside_a_block_19000", "In strict mode code, functions can only be declared at top level or inside a block.");
   case 19001 :
      return diag(19001, ts.DiagnosticCategory.Error, "Class_Declaration_can_only_be_declared_at_top_level_or_inside_a_block_19001", "Class Declaration can only be declared at top level or inside a block.");
   case 19002 :
      return diag(19002, ts.DiagnosticCategory.Error, "Incorrect_regular_expression_19002", "Incorrect regular expression");
   case 19003 :
      return diag(19003, ts.DiagnosticCategory.Error, "Invalid_regular_expression_Colon_0_Colon_Invalid_escape_19003", "Invalid regular expression: '{0}': Invalid escape");
   case 19004 :
      return diag(19004, ts.DiagnosticCategory.Error, "_8_and_9_are_not_allowed_in_strict_mode_19004", "\\8 and \\9 are not allowed in strict mode");
   case 19005 :
      return diag(19005, ts.DiagnosticCategory.Error, "const_and_let_declarations_not_allowed_in_statement_positions_19005", "const and let declarations not allowed in statement positions");
   case 19006 :
      return diag(19006, ts.DiagnosticCategory.Error, "Getter_must_not_have_any_formal_parameters_19006", "Getter must not have any formal parameters");
   case 19007 :
      return diag(19007, ts.DiagnosticCategory.Error, "Class_declaration_not_allowed_in_statement_position_19007", "Class declaration not allowed in statement position");
   case 19008 :
      return diag(19008, ts.DiagnosticCategory.Error, "Lexical_declaration_let_not_allowed_in_statement_position_19008", "Lexical declaration 'let' not allowed in statement position");
   case 19009 :
      return diag(19009, ts.DiagnosticCategory.Error, "Lexical_declaration_const_not_allowed_in_statement_position_19009", "Lexical declaration 'const' not allowed in statement position");
   case 19010 :
      return diag(19010, ts.DiagnosticCategory.Error, "Invalid_regular_expression_flag_0_19010", "Invalid regular expression flag '{0}'");
   case 20000 :
      return diag(20000, ts.DiagnosticCategory.Error, "Unexpected_eval_or_arguments_in_strict_mode_20000", "Unexpected eval or arguments in strict mode");
   default :
      console.log('The syntax error code is not supported.');
      return undefined;
    }
};