const INTERNAL_STATE_KEY = Symbol("state");
      const isArr = (x) => Array.isArray(x);
      const isObj = (x) =>
        Object.prototype.toString.call(x) === "[object Object]";

      function proxy(origin, onWirte, host) {
        const copy = isArr(origin) ? [] : getCleanCopy(origin);
        let map = Object.create(null);
        let draft = {
          origin,
          copy,
          modified: false,
          onWirte,
        };
        return new Proxy(origin, {
          get(target, key, receiver) {
            if (key === INTERNAL_STATE_KEY) return draft;
            if (key === "IS_BERIAL_SANDBOX") return true;
            if (key in map) return map[key];
            if (isObj(origin[key])) {
              map[key] = proxyProps(origin[key], key, draft);
              return map[key];
            } else {
              if (draft.modified) return copy[key];
              return target[key];
            }
          },
          set(target, key, value) {
            if (isObj(value)) map[key] = proxyProps(value, key, draft);
            copyOnWrite(draft);
            copy[key] = value;
            return true;
          },
        });
      }

      function proxyProps(props, key, draft) {
        const { origin, copy, onWirte } = draft;
        return proxy(props, (obj) => (copy[key] = obj), null);
      }

      function copyOnWrite(draft) {
        const { origin, copy, modified, onWirte } = draft;
        if (!modified) {
          draft.modified = true;
          onWirte && onWirte(copy);
          for (const k in source) {
            if (!(k in target)) target[k] = source[k];
          }
        }
      }

      function getTarget(draft) {
        return draft.modified ? draft.copy : draft.origin;
      }

      function getCleanCopy(obj) {
        return Object.create(Object.getPrototypeOf(obj));
      }
