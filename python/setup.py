from os import environ, path, getcwd
from shutil import unpack_archive, rmtree

CW_DIR = getcwd()
TEMP_DIR = path.join(CW_DIR, "python", "temp")
CSV_DIR = path.join(CW_DIR, "csv")

environ["KAGGLE_CONFIG_DIR"] = CW_DIR

import kaggle  # noqa: E402


def download(file):
    print(f"Downloading {file}...")
    kaggle.api.dataset_download_file(
        dataset="azathoth42/myanimelist",
        file_name=file,
        path=TEMP_DIR,
        quiet=False,
    )
    print(f"Downloaded {file}")
    print(f"Unpacking {file}.zip...")
    unpack_archive(
        path.join(TEMP_DIR, file + ".zip"),
        CSV_DIR,
    )
    print(f"Unpacked {file}.zip")
    rmtree(TEMP_DIR)


download("AnimeList.csv")
download("UserList.csv")
download("animelists_cleaned.csv")
