#!/usr/bin/env python3
# Copyright (c) 2023 Huawei Technologies Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import sys
import logging
from rich.style import Style
from rich.text import Text
from rich.highlighter import Highlighter
from rich.logging import RichHandler

def _combine_regex(*regexes: str) -> str:
    """Combine a number of regexes in to a single regex.
    Returns:
        str: New regex with all regexes ORed together.
    """
    return "|".join(regexes)

class AdvancedHighlighter(Highlighter):
    """Highlights the text typically produced from ``__repr__`` methods."""

    base_style = "repr."
    re_highlights = [
        r"(?P<tag_start><)(?P<tag_name>[-\w.:|]*)(?P<tag_contents>[\w\W]*)(?P<tag_end>>)",
        # r'(?P<attrib_name>\B-[\w_]{1,50})=(?P<attrib_value>"?[\w_]+"?)?',
        r"(?P<brace>[][{}()])",
        r'(?P<attrib_name>\B-{1,2}[\w_-]{1,50})=(?P<attrib_value>"?[\w_+=-]+"?)?',
        _combine_regex(
            r"(?P<ipv4>[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})",
            r"(?P<ipv6>([A-Fa-f0-9]{1,4}::?){7}[A-Fa-f0-9]{1,4})",
            r"(?P<eui64>(?:[0-9A-Fa-f]{1,2}-){7}[0-9A-Fa-f]{1,2}|(?:[0-9A-Fa-f]{1,2}:){7}[0-9A-Fa-f]{1,2}|(?:[0-9A-Fa-f]{4}\.){3}[0-9A-Fa-f]{4})",
            r"(?P<eui48>(?:[0-9A-Fa-f]{1,2}-){5}[0-9A-Fa-f]{1,2}|(?:[0-9A-Fa-f]{1,2}:){5}[0-9A-Fa-f]{1,2}|(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})",
            r"(?P<uuid>[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})",
            # r"(?P<call>[\w.]*?)\(",
            r"\b(?P<bool_true>True)\b|\b(?P<bool_false>False)\b|\b(?P<none>None)\b",
            r"(?P<ellipsis>\.\.\.)",
            r"(?P<number_complex>(?<!\w)(?:\-?[0-9]+\.?[0-9]*(?:e[-+]?\d+?)?)(?:[-+](?:[0-9]+\.?[0-9]*(?:e[-+]?\d+)?))?j)",
            r"(?P<number>(?<!\w)\-?[0-9]+\.?[0-9]*(e[-+]?\d+?)?\b|0x[0-9a-fA-F]*)",
            r"-I(?P<path>((\.\.)?|\b[-\w_]+)(/[-\w._+]+)*\/)(?P<filename>[-\w._+]*)?",
            r"(?<![\\\w])(?P<str>b?'''.*?(?<!\\)'''|b?'.*?(?<!\\)'|b?\"\"\".*?(?<!\\)\"\"\"|b?\".*?(?<!\\)\")",
            r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#]*)",
        ),
    ]

    def highlight(self, text: Text) -> None:
        highlight_words = text.highlight_words
        highlight_regex = text.highlight_regex
        for re_highlight in self.re_highlights:
            highlight_regex(re_highlight, style_prefix=self.base_style)

        # Highlight -Dxxx, -fxxx, -Wxxx
        highlight_regex(r"\B(?P<attrib_name>-(D|f|W)[\w+_-]{1,50})", style_prefix=self.base_style)
        # Highlight "error" / "failed" / "invalid"
        highlight_words(["error:", "warning:", "ERROR", "invalid"], style=Style(color="bright_red", bold=True), case_sensitive=True)
        highlight_words(["failed:", "failed"], style=Style(color="bright_red", bold=True), case_sensitive=False)
        # Highlight "success" / "done"
        highlight_words(["successfully", "success", "done."], style=Style(color="bright_green", bold=True), case_sensitive=False)
        # Highlight CC / CXX / ASM / AR / SOLINK / LINK / STAMP / COPY
        highlight_words([" CC ", " CXX ", " ASM ", " AR ", " SOLINK ", " LINK  ", " STAMP ", " COPY "], style=Style(color="yellow", bold=True), case_sensitive=True)
        # Highlight GN print
        highlight_words(["[GN INFO]"], style=Style(color="blue", bold=True), case_sensitive=False)
        highlight_words(["[GN DEBUG]"], style=Style(color="dark_blue", bold=True), case_sensitive=False)
        highlight_words(["[GN ERROR]", "[GN WARNING]"], style=Style(color="red", bold=True), case_sensitive=False)
        # Highlight ^~~~~~~ & ^------
        highlight_regex(r"\B(\^~+)", style=Style(color="red", bold=True))
        highlight_regex(r"\B(\^-+)", style=Style(color="red", bold=True))

class LoggerManager:
    """
    LoggerManager is a singleton.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        pass

    def setup_level(self, log_level: str):
        log_level = log_level.upper()

        try:
            handler = RichHandler(rich_tracebacks=True,highlighter=AdvancedHighlighter())
            logging.basicConfig(
                level=log_level,
                format="%(message)s",
                datefmt="[%X]",
                handlers=[handler]
            )
        except:
            self.get_logger().error("Invalid log level: '%s'", log_level)
            sys.exit(1)

        self.log_level = log_level

    def add_file_logger(self, out_path, expire_time=2) -> None:
        # self.file_logger_handler = loguru_logger.add(
        #         os.path.join(self.args.project_dir, "out", "log", "build", "builder.log"),
        #         level="DEBUG",
        #         format="<lvl>[{level:<8}]</lvl> {time:HH:mm:ss} | <c>{file}:{line} {name}({module})</c> | {process}:{thread} | <lvl>{message}</lvl>",
        #         retention="1 day",
        #         rotation=datetime.timedelta(hours=2)
        #     )
        pass

    def get_logger(self) -> logging.Logger:
        return logging.getLogger("rich")

logger = LoggerManager().get_logger()
