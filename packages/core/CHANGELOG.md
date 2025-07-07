# Changelog

## `v3.0.0-alpha.3` - `unreleased`

## **Changed**

- If raw and processed `value` are similar, return raw value (default `processUtilities` return)
- Same as variant/prefix, if the raw variant is available but the processed variant is null, just return the variant.

## Added

- New `transform` plugin for final data processing, higher than `process` plugin. Useful when generating final data from the framework.

## `v3.0.0-alpha.2` - `2025-07-02`

## **Changed**

- New default value output, `raw` and `data` is a separate

## Development

- Update types

## `v3.0.0-alpha.1` - `2025-06-30`

### **Changed**

- New import for types
- Updating some `any` types

## `v3.0.0-alpha.0` - `2025-06-30`

### **Changed**

- **Refactor the entire API**

### Development

- Dropped `@tenoxui/moxie` engine, and recreate it (plan for later) as plugin for new Core API.

---

This changelog is made manually since `29/04/2025`.
