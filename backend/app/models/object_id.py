from bson import ObjectId
from typing import Any
from pydantic import GetJsonSchemaHandler
from pydantic_core import CoreSchema, core_schema

class PydanticObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: Any,
    ) -> CoreSchema:
        return core_schema.union_schema(
            [
                core_schema.str_schema(
                    serialization=core_schema.plain_serializer_function_ser_schema(
                        lambda x: str(x),
                        return_schema=core_schema.str_schema(),
                        when_used='json'
                    )
                ),
                core_schema.is_instance_schema(ObjectId)
            ],
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls,
        _core_schema: CoreSchema,
        _handler: GetJsonSchemaHandler,
    ) -> dict[str, Any]:
        return {"type": "string"}

    def __repr__(self) -> str:
        return f"PydanticObjectId({super().__repr__()})"