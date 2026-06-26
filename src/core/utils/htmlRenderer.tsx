import React from "react";
import { Text, View, StyleSheet, Linking } from "react-native";
import { Parser } from "htmlparser2";
import { useTheme } from "@/core/theme";
import { spacing, fontSize, fontWeight } from "@/core/design-system";

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"');
}

interface HtmlNode {
  type: "text" | "tag";
  tagName?: string;
  children?: HtmlNode[];
  text?: string;
  attribs?: Record<string, string>;
}

function parseHtml(html: string): HtmlNode[] {
  const root: HtmlNode[] = [];
  const stack: HtmlNode[] = [{ type: "tag", tagName: "root", children: root }];

  const parser = new Parser({
    onopentag(name, attribs) {
      const node: HtmlNode = {
        type: "tag",
        tagName: name,
        attribs,
        children: [],
      };
      const parent = stack[stack.length - 1];
      parent.children?.push(node);
      stack.push(node);
    },
    ontext(text) {
      const parent = stack[stack.length - 1];
      const trimmedText = text.trim();
      if (trimmedText) {
        parent.children?.push({
          type: "text",
          text: decodeHtmlEntities(trimmedText),
        });
      }
    },
    onclosetag() {
      stack.pop();
    },
  });

  parser.write(html);
  parser.end();

  return root;
}

function isEmptyNode(node: HtmlNode): boolean {
  if (node.type === "text") {
    return !node.text || node.text.trim().length === 0;
  }
  if (node.type === "tag") {
    if (node.tagName === "br" || node.tagName === "hr") return false;
    if (!node.children || node.children.length === 0) return true;
    return node.children.every(isEmptyNode);
  }
  return true;
}

function countConsecutiveBr(nodes: HtmlNode[]): number {
  let count = 0;
  for (const node of nodes) {
    if (node.type === "tag" && node.tagName === "br") {
      count++;
    } else {
      break;
    }
  }
  return count;
}

function cleanExcessiveBr(nodes: HtmlNode[]): HtmlNode[] {
  const result: HtmlNode[] = [];
  let consecutiveBr = 0;
  const maxConsecutiveBr = 1;

  for (const node of nodes) {
    if (node.type === "tag" && node.tagName === "br") {
      consecutiveBr++;
      if (consecutiveBr <= maxConsecutiveBr) {
        result.push(node);
      }
    } else {
      result.push(node);
      consecutiveBr = 0;
    }
  }

  return result;
}

interface HtmlNodeRendererProps {
  node: HtmlNode;
  theme: ReturnType<typeof useTheme>["theme"];
}

function HtmlNodeRenderer({ node, theme }: HtmlNodeRendererProps) {
  if (node.type === "text") {
    return (
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {node.text}
      </Text>
    );
  }

  if (node.type === "tag") {
    if (isEmptyNode(node) && node.tagName !== "br" && node.tagName !== "hr") {
      return null;
    }

    const children = cleanExcessiveBr(node.children || []);

    switch (node.tagName) {
      case "p":
        const nonBrChildren = children.filter(
          (c) => !(c.type === "tag" && c.tagName === "br"),
        );
        if (nonBrChildren.length === 0) {
          return null;
        }

        return (
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "strong":
      case "b":
        return (
          <Text style={[styles.bold, { color: theme.colors.text }]}>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "ul":
        return (
          <View style={styles.list}>
            {children
              .filter((c) => c.tagName === "li")
              .map((child, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={[styles.bullet, { color: theme.colors.text }]}>
                    •{" "}
                  </Text>
                  <Text style={[styles.listText, { color: theme.colors.text }]}>
                    {child.children
                      ?.filter((c) => !isEmptyNode(c))
                      .map((grandchild, j) => (
                        <HtmlNodeRenderer
                          key={j}
                          node={grandchild}
                          theme={theme}
                        />
                      ))}
                  </Text>
                </View>
              ))}
          </View>
        );
      case "ol":
        return (
          <View style={styles.list}>
            {children
              .filter((c) => c.tagName === "li")
              .map((child, i) => (
                <View key={i} style={styles.listItem}>
                  <Text
                    style={[styles.number, { color: theme.colors.text }]}
                  >{`${i + 1}. `}</Text>
                  <Text style={[styles.listText, { color: theme.colors.text }]}>
                    {child.children
                      ?.filter((c) => !isEmptyNode(c))
                      .map((grandchild, j) => (
                        <HtmlNodeRenderer
                          key={j}
                          node={grandchild}
                          theme={theme}
                        />
                      ))}
                  </Text>
                </View>
              ))}
          </View>
        );
      case "li":
        return (
          <>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </>
        );
      case "a":
        return (
          <Text
            style={[styles.link, { color: theme.colors.primary }]}
            onPress={() =>
              node.attribs?.href && Linking.openURL(node.attribs.href)
            }
          >
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "h1":
        return (
          <Text style={[styles.h1, { color: theme.colors.text }]}>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "h2":
        return (
          <Text style={[styles.h2, { color: theme.colors.text }]}>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "h3":
        return (
          <Text style={[styles.h3, { color: theme.colors.text }]}>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </Text>
        );
      case "br":
        return <Text> </Text>;
      case "hr":
        return (
          <View style={[styles.hr, { backgroundColor: theme.colors.border }]} />
        );
      case "img":
        return null;
      case "div":
      case "span":
        return (
          <>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </>
        );
      default:
        return (
          <>
            {children.map((child, i) => (
              <HtmlNodeRenderer key={i} node={child} theme={theme} />
            ))}
          </>
        );
    }
  }

  return null;
}

export function HtmlRenderer({ html }: { html: string }) {
  const { theme } = useTheme();
  const nodes = parseHtml(html);
  const filteredNodes = nodes.filter((node) => !isEmptyNode(node));

  return (
    <>
      {filteredNodes.map((node, i) => (
        <HtmlNodeRenderer key={i} node={node} theme={theme} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  paragraph: {
    marginBottom: spacing.sm,
  },
  bold: {
    fontWeight: fontWeight.bold,
  },
  list: {
    marginBottom: spacing.sm,
    paddingLeft: spacing.md,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: spacing.xs,
    flexWrap: "wrap" as const,
    alignItems: "flex-start" as const,
  },
  listText: {
    flex: 1,
    flexWrap: "wrap" as const,
  },
  bullet: {
    fontSize: fontSize.base,
    marginRight: spacing.xs,
    fontWeight: fontWeight.bold,
    flexShrink: 0 as const,
  },
  number: {
    fontSize: fontSize.base,
    marginRight: spacing.xs,
    fontWeight: fontWeight.bold,
    flexShrink: 0 as const,
  },
  link: {
    textDecorationLine: "underline" as const,
  },
  h1: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  h2: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  h3: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  hr: {
    height: 1,
    marginVertical: spacing.sm,
  },
});
