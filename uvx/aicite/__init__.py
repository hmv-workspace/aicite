try:
    from importlib.metadata import version
    __version__ = version("aicite")
except Exception:
    # Fallback for development or if package is not installed
    __version__ = "0.0.0-dev"
