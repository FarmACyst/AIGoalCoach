using Newtonsoft.Json.Schema;
using Newtonsoft.Json.Schema.Generation;

namespace AIGoalCoach.Core.Utilities
{
    public static class JsonHelper
    {
        public static object GenerateSchema<T>()
        {
            JSchemaGenerator generator = new JSchemaGenerator();
            JSchema schema = generator.Generate(typeof(T));
            return schema;
        }
    }
}
