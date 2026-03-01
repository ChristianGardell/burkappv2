from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

ip_limiter = Limiter(key_func=get_remote_address)


def get_phone_or_ip(request: Request) -> str:
    try:
        phone = request.state.body.get("phone_number")
        if phone:
            return f"phone:{phone}"
    except Exception:
        pass
    return f"ip:{get_remote_address(request)}"


phone_limiter = Limiter(key_func=get_phone_or_ip)
