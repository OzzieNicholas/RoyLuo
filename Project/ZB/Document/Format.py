"""

# 读取 input.txt，去掉所有空行并做相应的替换，最终输出到 output.txt

def process_file(input_file, output_file):
    # 打开并读取文件内容
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 去掉空行并进行替换
    processed_lines = []
    for line in lines:
        stripped_line = line.strip()  # 去掉首尾的空白字符
        if stripped_line:  # 跳过空行
            # 替换 \[ \] \( \) 为 $
            modified_line = stripped_line.replace(r'\(', '$').replace(r'\)', '$').replace(r'\[', '$').replace(r'\]', '$')
            # 替换 $$ 为单个 $
            modified_line = modified_line.replace('$$', '$')
            processed_lines.append(modified_line)

    # 将处理后的内容写入 output.txt
    with open(output_file, 'w', encoding='utf-8') as f:
        for line in processed_lines:
            f.write(line + '\n')

# 调用函数处理文件
process_file('input.txt', 'output.txt')  # 取消注释这一行以运行代码

"""

# 读取文件
with open('reference.txt', 'r', encoding='utf-8') as file:
    lines = file.readlines()

# 先去掉所有空行
lines = [line for line in lines if line.strip()]

# 重新编号
new_lines = []
for i, line in enumerate(lines):
    # 找到第一个']'的位置，之后的内容保留
    idx = line.find(']')
    if idx != -1:
        new_line = f"[{i + 1}]{line[idx + 1:]}"
    else:
        new_line = f"[{i + 1}]{line}"  # 如果找不到']'，直接在前面加上新的序号
    new_lines.append(new_line)

# 写入新文件
with open('output.txt', 'w', encoding='utf-8') as file:
    file.writelines(new_lines)

print("文献已重新编号并保存到 'output.txt'")
