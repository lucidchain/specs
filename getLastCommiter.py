import os
import git


repo = git.Repo(search_parent_directories=True)
docs_dir = 'docs'

def get_commit_info(file_path):
    commit = next(repo.iter_commits(paths=file_path, max_count=1))
    return commit.author.name, commit.committed_datetime.strftime('%Y-%m-%d %H:%M:%S')

for root, dirs, files in os.walk(docs_dir):
    for file in files:
        if file.endswith(".md"):
            file_path = os.path.join(root, file)
            author, commit_date = get_commit_info(file_path)

            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            if content.startswith('---'):
                yaml_end = content.find('---', 3)
                yaml_content = content[3:yaml_end].strip()
                main_content = content[yaml_end + 3:].strip()

                yaml_content += f"\nlast_commiter: {author}"

                content = f"---\n{yaml_content}\n---\n{main_content}"

            else:
                content = f"---\nlast_commiter: {author}\n---\n{content}"

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)

print("Commit information added to YAML metadata.")
