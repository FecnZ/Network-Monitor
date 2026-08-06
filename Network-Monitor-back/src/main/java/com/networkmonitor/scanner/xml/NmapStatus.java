package com.networkmonitor.scanner.xml;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NmapStatus {

    @JacksonXmlProperty(isAttribute = true)
    private String state;
}