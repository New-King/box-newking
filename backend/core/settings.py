# @Time    : 2023/8/15 09:51
# @Author  : Lan
# @File    : settings.py
# @Software: PyCharm
from pathlib import Path

ADMIN_SESSION_EXPIRE_DEFAULT = 30 * 24 * 60 * 60
ADMIN_SESSION_EXPIRE_MIN = 24 * 60 * 60
ADMIN_SESSION_EXPIRE_MAX = 365 * 24 * 60 * 60

BASE_DIR = Path(__file__).resolve().parent.parent
data_root = BASE_DIR / "data"

if not data_root.exists():
    data_root.mkdir(parents=True, exist_ok=True)

DEFAULT_CONFIG = {
    "file_storage": "local",
    "storage_path": "",
    "storageLimit": 0,
    "name": "box-newking",
    "description": "New King 内网文件快传服务（box.new-king.com）",
    "notify_title": "系统通知",
    "notify_content": '欢迎使用 box-newking。基于 <a href="https://github.com/vastsa/FileCodeBox" target="_blank">FileCodeBox</a> 二次开发，源码见 <a href="https://github.com/New-King/box-newking" target="_blank">GitHub</a>。',
    "page_explain": "请勿上传或分享违法内容。本服务仅供 New King 内部使用，请勿将取件链接对外传播。",
    "keywords": "box-newking, new-king, 文件快传, 内网传输",
    "s3_access_key_id": "",
    "s3_secret_access_key": "",
    "s3_bucket_name": "",
    "s3_endpoint_url": "",
    "s3_region_name": "auto",
    "s3_signature_version": "s3v2",
    "s3_hostname": "",
    "s3_addressing_style": "auto",
    "s3_proxy": 0,
    "max_save_seconds": 0,
    "aws_session_token": "",
    "onedrive_domain": "",
    "onedrive_client_id": "",
    "onedrive_username": "",
    "onedrive_password": "",
    "onedrive_root_path": "filebox_storage",
    "onedrive_proxy": 0,
    "webdav_root_path": "filebox_storage",
    "webdav_proxy": 0,
    "admin_token": "",
    "jwt_secret": "",
    "adminSessionExpire": ADMIN_SESSION_EXPIRE_DEFAULT,
    "openUpload": 1,
    "uploadSize": 1024 * 1024 * 10,
    "allowed_file_types": ["*"],
    "expireStyle": ["day", "hour", "minute", "forever", "count"],
    "code_generate_type": "secret",
    "uploadMinute": 1,
    "enableChunk": 0,
    "webdav_url": "",
    "webdav_password": "",
    "webdav_username": "",
    "opacity": 0.9,
    "background": "",
    "uploadCount": 10,
    "themesChoices": [
        {
            "name": "2023",
            "key": "themes/2023",
            "author": "Lan",
            "version": "1.0",
        },
        {
            "name": "2024",
            "key": "themes/2024",
            "author": "Lan",
            "version": "1.0",
        },
    ],
    "themesSelect": "themes/2024",
    "errorMinute": 1,
    "errorCount": 10,
    "loginCount": 5,
    "loginMinute": 15,
    "serverWorkers": 1,
    "serverHost": "0.0.0.0",
    "serverPort": 12345,
    "showAdminAddr": 0,
    "robotsText": "User-agent: *\nDisallow: /",
    "trustedProxies": [],
}


class Settings:
    def __init__(self, defaults=None):
        self.default_config = defaults or {}
        self.user_config = {}

    def __getattr__(self, attr):
        if attr in self.user_config:
            return self.user_config[attr]
        if attr in self.default_config:
            return self.default_config[attr]
        raise AttributeError(
            f"'{self.__class__.__name__}' object has no attribute '{attr}'"
        )

    def __setattr__(self, key, value):
        if key in ["default_config", "user_config"]:
            super().__setattr__(key, value)
        else:
            self.user_config[key] = value

    def items(self):
        return {**self.default_config, **self.user_config}.items()


settings = Settings(DEFAULT_CONFIG)
